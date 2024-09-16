import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../utils/baseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Roles } from '../Types';
import { Courses } from 'src/courses/entities/courses.entity';

@ObjectType()
@Entity()
export class Users extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'enum', enum: Roles, default: Roles.STUDENT })
  role: Roles;

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true, type: 'timestamp' })
  tokenExpiry?: Date;

  @Column({ nullable: true, default: false })
  usedToken?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [Courses], { nullable: 'itemsAndList' })
  @OneToMany(() => Courses, (courses) => courses.instructor, { eager: true })
  coursesInstructing: Courses[];
}
