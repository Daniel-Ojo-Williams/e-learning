import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateModuleInput {
  @Field({ description: 'Title of the module' })
  @IsString()
  title: string;

  @Field({ description: 'ID of the course the module belongs to' })
  @IsString()
  @IsUUID()
  courseId: string;
}
