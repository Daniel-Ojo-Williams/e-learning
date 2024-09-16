import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Courses } from './entities/courses.entity';
import { CourseDetails } from './dto/add-course.dto';
import { AuthPayload, Roles as Role } from 'src/users/Types';
import { ParseUUIDPipe } from '@nestjs/common';
import { Roles } from 'src/guards/roles.guard';
import { UpdateCourseInput } from './dto/update-course.dto';

@Resolver()
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Courses)
  @Roles(Role.INSTRUCTOR)
  async addCourse(
    @Args('courseDetails') courseDetails: CourseDetails,
    @Context() context,
  ) {
    const { sub: instructorId } = context.$user as AuthPayload;

    return this.coursesService.addCourse(courseDetails, instructorId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => Courses)
  @Roles(Role.INSTRUCTOR)
  async updateCourse(
    @Args('courseDetails') updateCourse: UpdateCourseInput,
    @Args('courseId', ParseUUIDPipe) courseId: string,
    @Context() context,
  ) {
    const { sub: instructorId } = context.$user as AuthPayload;

    return this.coursesService.updateCourse(
      courseId,
      updateCourse,
      instructorId,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => Courses)
  async getACourse(@Args('courseId', ParseUUIDPipe) courseId: string) {
    return this.coursesService.findCourseById(courseId);
  }
}
