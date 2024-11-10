import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
// import { FileUpload } from '../types';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { LessonTypes } from '../entities/lessons.entity';

registerEnumType(LessonTypes, {
  name: 'LessonTypes',
});

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

  @Field(() => LessonTypes)
  @IsString()
  @IsNotEmpty()
  type: LessonTypes;
}
