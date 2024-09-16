import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ConfirmEmail {
  @Field()
  @IsNotEmpty()
  @IsString()
  token: string;
}
