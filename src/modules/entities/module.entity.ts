import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../utils/baseEntity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Courses } from 'src/courses/entities/courses.entity';
import { Lessons } from 'src/lessons/entities/lessons.entity';

@ObjectType({ description: 'Module groups lessons into different sections' })
@Entity()
export class Module extends BaseEntity {
  @Field({ description: 'Title of the module' })
  @Column()
  title: string;

  @ManyToOne(() => Courses, (course) => course.modules)
  course: Courses;

  @Field(() => [Lessons], { description: 'Lessons in a module' })
  @OneToMany(() => Lessons, (lesson) => lesson.module)
  lessons: Lessons[];
}
