import { InputType, PartialType } from '@nestjs/graphql';
import { CourseDetails } from './add-course.dto';

@InputType()
export class UpdateCourseInput extends PartialType(CourseDetails) {}
