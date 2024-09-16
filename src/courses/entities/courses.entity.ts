import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../utils/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Users } from '../../users/entities/user.entity';
import { CourseContent } from '../../course-content/entities/course-content.entity';

@ObjectType()
@Entity()
export class Courses extends BaseEntity {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Users)
  @ManyToOne(() => Users, (users) => users.coursesInstructing, {
    nullable: false,
  })
  @JoinColumn({ name: 'instructorId' })
  instructor: Users;

  @Field()
  @Column()
  duration: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Boolean)
  @Column({ type: 'boolean' })
  availabile: boolean;

  @Field(() => CourseContent)
  @OneToMany(() => CourseContent, (courseContent) => courseContent.course, {
    cascade: true,
  })
  courseContents: CourseContent[];
}