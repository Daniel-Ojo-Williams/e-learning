import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../utils/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Users } from '../../users/entities/user.entity';
import { Module } from 'src/modules/entities/module.entity';

@ObjectType()
@Entity()
export class Courses extends BaseEntity {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field(() => Users, {
    nullable: true,
    description: 'Instructor of the course',
  })
  @ManyToOne(() => Users, (users) => users.coursesInstructing, {
    nullable: false,
    eager: false,
  })
  @JoinColumn({ name: 'instructorId' })
  instructor: Users;

  @Field()
  @Column()
  duration: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  availabile: boolean;

  @Field(() => [Module], {
    description: 'Modules under a course, which groups lessons for this course',
    nullable: true,
  })
  @OneToMany(() => Module, (module) => module.course, { eager: false })
  modules: Module[];
}
