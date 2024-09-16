import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IS_PUBLIC } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CompositeGuard implements CanActivate {
  constructor(
    private ref: Reflector,
    private readonly authGuard: AuthGuard,
    private readonly rolesGuard: RolesGuard,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const isPublic = this.ref.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(),
    ]);

    if (isPublic) return true;

    const authGuardResult = await this.authGuard.canActivate(context);

    if (!authGuardResult) return false;

    return this.rolesGuard.canActivate(context);
  }
}
