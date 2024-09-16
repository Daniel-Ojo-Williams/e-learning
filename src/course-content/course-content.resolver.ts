/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CourseContentService } from './course-content.service';
import { CourseContent } from './entities/course-content.entity';
import { CreateCourseContent } from './dto/add-course-content.dto';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Resolver((_of) => CourseContent)
export class CourseContentResolver {
  constructor(private readonly courseContentService: CourseContentService) {}

  @Mutation((returns) => CourseContent)
  async createCourseContent(
    @Args('createCourseContent') createCourseContent: CreateCourseContent,
    @Args({ name: 'content', type: () => GraphQLUpload })
    content: FileUpload,
  ) {
    return this.courseContentService.createCourseContent(
      createCourseContent,
      content,
    );
  }
}
