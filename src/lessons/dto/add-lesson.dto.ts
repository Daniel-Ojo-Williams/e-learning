import { Field, InputType, Int } from '@nestjs/graphql';
// import { FileUpload } from '../types';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
// import * as GraphQLUpload from 'graphql-upload';
// import type { FileUpload } from 'graphql-upload/processRequest.js';

@InputType()
export class CreateLesson {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  sequenceNumber: number;

  @Field()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  moduleId: string;
}
