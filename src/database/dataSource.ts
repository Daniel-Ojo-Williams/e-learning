import { DataSource, DataSourceOptions } from 'typeorm';
import { validate } from '../config/validateEnv';
import 'dotenv/config';

const env = validate(process.env);

const dataSourceOptions: DataSourceOptions = {
  type: env.DB_TYPE as 'postgres',
  database: env.DB_NAME,
  host: env.DB_HOST,
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js'],
  synchronize: false,
  username: env.DB_USER,
  port: env.DB_PORT,
  password: env.DB_PASS,
  ssl: {
    rejectUnauthorized: false,
    ca: env.DB_CA_CERT,
  },
};

export const dataSource = new DataSource(dataSourceOptions);
