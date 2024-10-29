import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonResolver } from './lessons.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lessons } from './entities/lessons.entity';
import { ModulesModule } from 'src/modules/modules.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lessons]), ModulesModule],
  providers: [LessonResolver, LessonsService],
})
export class CourseContentModule {}
