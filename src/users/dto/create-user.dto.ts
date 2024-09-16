import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUser {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((_type) => Boolean, { nullable: true })
  @IsBoolean()
  isInstructor?: boolean;
}
