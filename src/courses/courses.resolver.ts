import {
  Args,
  Context,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Courses } from './entities/courses.entity';
import { CourseDetails } from './dto/add-course.dto';
import { AuthPayload, Roles as Role } from 'src/users/Types';
import { ParseUUIDPipe } from '@nestjs/common';
import { Roles } from 'src/guards/roles.guard';
import { UpdateCourseInput } from './dto/update-course.dto';
import { ReqContext } from 'src/guards/types';
import { Module } from 'src/modules/entities/module.entity';
import { ModulesService } from 'src/modules/modules.service';
import { SearchCourses } from './dto/get-courses.dto';

@Resolver(() => Courses)
export class CoursesResolver {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly moduleService: ModulesService,
  ) {}

  @Mutation(() => Courses)
  @Roles(Role.INSTRUCTOR)
  async addCourse(
    @Args('courseDetails') courseDetails: CourseDetails,
    @Context() context: ReqContext,
  ) {
    const { sub: instructorId } = context.$user;

    return this.coursesService.addCourse(courseDetails, instructorId);
  }

  @Mutation(() => Courses)
  @Roles(Role.INSTRUCTOR)
  async updateCourse(
    @Args('courseDetails') updateCourse: UpdateCourseInput,
    @Args('courseId', ParseUUIDPipe) courseId: string,
    @Context() context: ReqContext,
  ) {
    const { sub: instructorId } = context.$user as AuthPayload;

    return this.coursesService.updateCourse(
      courseId,
      updateCourse,
      instructorId,
    );
  }

  @Query(() => Courses)
  async getACourse(@Args('courseId', ParseUUIDPipe) courseId: string) {
    return this.coursesService.findCourseById(courseId);
  }

  @Query(() => [Courses])
  async getAllCourses(
    @Args('search', {
      nullable: true,
      description: 'Keyword to search for course title',
    })
    search?: SearchCourses,
  ) {
    return this.coursesService.getAllCourses(search);
  }

  @ResolveField('modules', () => [Module])
  async getCourseModules(@Parent() course: Courses) {
    const { id } = course;
    const modules = await this.moduleService.findAllCourseModules(id);

    return modules;
  }
}
