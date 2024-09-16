import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CourseDetails {
  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  duration: string;

  @IsBoolean()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Boolean)
  @IsNotEmpty()
  availabile: boolean;
}
