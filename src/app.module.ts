import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/validateEnv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleConfig } from './database/ORMConfig';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { GqlHttpExceptionFilter } from './filters/gqlFilter';
import { MailModule } from './mail/mail.module';
import { CoursesModule } from './courses/courses.module';
import { CompositeGuard } from './guards/composite-guards.guard';
import { RolesGuard } from './guards/roles.guard';
import { CourseContentModule } from './lessons/lessons.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync(TypeOrmModuleConfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          uploads: false,
          formatError: (error) => {
            return {
              message: error.message,
              code: error.extensions.code,
            };
          },
        };
      },
    }),
    UsersModule,
    MailModule,
    CoursesModule,
    CourseContentModule,
    ModulesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CompositeGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GqlHttpExceptionFilter,
    },
    AuthGuard,
    RolesGuard,
  ],
})
export class AppModule {}
