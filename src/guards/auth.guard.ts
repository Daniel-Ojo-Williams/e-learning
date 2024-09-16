import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthPayload } from '../users/Types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('JWT_ACCESS') private jwtAccess: JwtService,
    private ref: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const request = gqlContext.req;

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException({ message: 'Token Not Found' });

    try {
      const user = await this.jwtAccess.verifyAsync<AuthPayload>(token);

      gqlContext.$user = user;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException({ message: 'Token Expired' });

      if (error instanceof JsonWebTokenError)
        throw new UnauthorizedException({
          message: 'Please login to receive a valid token',
        });
      throw new InternalServerErrorException();
    }

    return true;
  }

  extractTokenFromHeader(req: Request): string {
    const [type, token] = req.headers.authorization?.split(' ') || [];

    return type === 'Bearer' ? token : undefined;
  }
}

export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);
