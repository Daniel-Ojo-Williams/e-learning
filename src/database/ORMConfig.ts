import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

class TypeOrmConfig {
  static getConfigOptions(env: ConfigService): DataSourceOptions {
    return {
      type: env.get('DB_TYPE') as 'postgres',
      database: env.get<string>('DB_NAME'),
      host: env.get('DB_HOST'),
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/database/migrations/*.js'],
      synchronize: true,
      username: env.get('DB_USER'),
      port: env.get('DB_PORT'),
      password: env.get('DB_PASS'),
    };
  }
}

export const TypeOrmModuleConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (env: ConfigService): TypeOrmModuleAsyncOptions =>
    TypeOrmConfig.getConfigOptions(env),
  inject: [ConfigService],
};
