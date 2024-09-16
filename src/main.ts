import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
      'x-apollo-operation-name',
    ],
    methods: ['GET', 'PUT', 'DELETE', 'POST', 'OPTIONS'],
  });
  app.use(cookieParser());
  app.use(graphqlUploadExpress());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = Object.values(errors[0].constraints).join(', ');
        return new UnprocessableEntityException(formattedErrors);
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
