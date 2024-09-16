import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvVariables {
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
  SMTP_PORT: number;

  @IsString()
  SMTP_USERNAME: string;

  @IsString()
  SMTP_PASSWORD: string;
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
