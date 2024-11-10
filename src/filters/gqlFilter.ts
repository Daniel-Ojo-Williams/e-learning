import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { QueryFailedError } from 'typeorm';
import type { DatabaseError } from 'pg-protocol';

@Catch(HttpException)
export class GqlHttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);
    return new GraphQLError(exception.message, {
      extensions: {
        code: exception.getStatus(),
        http: {
          status: exception.getStatus(),
        },
      },
    });
  }
}

@Catch(QueryFailedError)
export class GqlQueryFailedErrorFilter implements GqlExceptionFilter {
  catch(exception: QueryFailedError<DatabaseError>, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);
    return new GraphQLError(exception.message, {
      extensions: {
        code: HttpStatus.BAD_REQUEST,
        HttpStatus: {
          status: HttpStatus.BAD_REQUEST,
        },
      },
    });
  }
}
