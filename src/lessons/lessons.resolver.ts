/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LessonsService } from './lessons.service';
import { Lessons } from './entities/lessons.entity';
import { CreateLesson } from './dto/add-lesson.dto';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Resolver(() => Lessons)
export class LessonResolver {
  constructor(private readonly lessonService: LessonsService) {}

  @Mutation((returns) => Lessons)
  async createLesson(
    @Args('createLesson') createLesson: CreateLesson,
    @Args({ name: 'content', type: () => GraphQLUpload })
    content: FileUpload,
  ) {
    return this.lessonService.createLesson(createLesson, content);
  }
}
