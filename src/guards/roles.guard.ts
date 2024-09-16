import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthPayload, Roles as Role } from 'src/users/Types';

const ROlES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROlES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly ref: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const user = gqlContext.$user as AuthPayload;

    const requiredRoles =
      this.ref.getAllAndOverride<Role[]>(ROlES_KEY, [ctx.getHandler()]) || [];

    if (!requiredRoles || !requiredRoles.length) return true;

    const hasRequiredRoles = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRoles)
      throw new UnauthorizedException({
        message: 'You do not have access to this resource',
      });

    return true;
  }
}
