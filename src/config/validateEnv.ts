import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

export class EnvVariables {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_PASS: string;

  @IsString()
  DB_TYPE: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_NAME: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_CA_CERT: string;

  @IsString()
  MAIL_HOST: string;

  @IsNumber()
  MAIL_PORT: number;

  @IsString()
  MAIL_USERNAME: string;

  @IsString()
  MAIL_PASSWORD: string;

  @IsString()
  S3_REGION: string;

  @IsString()
  S3_ACCESSKEYID: string;

  @IsString()
  S3_ACCESSKEYSECRET: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedEnvVariables = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedEnvVariables, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(errors.toString());
  }

  return validatedEnvVariables;
};
