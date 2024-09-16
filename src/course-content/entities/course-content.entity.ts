import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Courses } from 'src/courses/entities/courses.entity';
import { BaseEntity } from 'src/utils/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
@Entity()
export class CourseContent extends BaseEntity {
  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  uploadId: string;

  @Column('int')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int)
  sequenceNumber: number;

  @Field(() => Courses)
  @ManyToOne(() => Courses, (course) => course.courseContents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: Courses;
}
