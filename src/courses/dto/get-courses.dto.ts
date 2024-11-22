import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class SearchCourses {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  keyword: string;
}
