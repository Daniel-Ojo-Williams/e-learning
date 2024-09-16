import { Module } from '@nestjs/common';
import { CourseContentService } from './course-content.service';
import { CourseContentResolver } from './course-content.resolver';
import { CoursesModule } from 'src/courses/courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseContent } from './entities/course-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseContent]), CoursesModule],
  providers: [CourseContentResolver, CourseContentService],
})
export class CourseContentModule {}
