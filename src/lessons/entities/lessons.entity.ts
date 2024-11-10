import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Module } from 'src/modules/entities/module.entity';
import { BaseEntity } from 'src/utils/baseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum LessonTypes {
  READING = 'reading',
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
}

@ObjectType()
@Entity()
export class Lessons extends BaseEntity {
  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  uploadKey: string;

  @Column()
  @Field()
  mediaURL: string;

  @Column('enum', { enum: LessonTypes })
  @Field()
  type: LessonTypes;

  @Column({ nullable: true })
  @Field({ description: 'How long it would take to consume the resource' })
  duration: string;

  @Column('int')
  @Field(() => Int)
  sequenceNumber: number;

  @Field(() => Module)
  @ManyToOne(() => Module, (module) => module.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'moduleId' })
  module: Module;
}
