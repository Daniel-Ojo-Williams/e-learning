import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseContent } from './dto/add-course-content.dto';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import genToken from 'src/utils/genToken';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseContent } from './entities/course-content.entity';
import { DataSource, Repository } from 'typeorm';
import { CoursesService } from 'src/courses/courses.service';
import { FileUpload } from 'graphql-upload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CourseContentService {
  constructor(
    @InjectRepository(CourseContent)
    private courseContent: Repository<CourseContent>,
    private courseService: CoursesService,
    private dataSource: DataSource,
    private config: ConfigService,
  ) {}

  async createCourseContent(
    { description, sequenceNumber, title, courseId }: CreateCourseContent,
    content: FileUpload,
  ) {
    const { createReadStream } = await content;

    const s3 = new S3Client({
      region: this.config.get('S3_REGION'),
      credentials: {
        accessKeyId: this.config.get('S3_ACCESSKEYID'),
        secretAccessKey: this.config.get('S3_ACCESSKEYSECRET'),
      },
    });

    const { Key } = await new Promise<{ Key: string }>(async (resolve) => {
      const { token: id } = genToken();
      const Key = `${title}-${id}`;
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: 'd-e-learning',
          Key,
          Body: createReadStream(),
        },
      });
      await upload.done();

      resolve({ Key });
    });

    const course = await this.courseService.findCourseById(courseId);

    if (!course)
      throw new NotFoundException(
        'Course not found, please check and try again',
      );

    const courseContent = this.courseContent.create({
      description,
      sequenceNumber,
      uploadId: Key,
      course,
      title,
    });

    course.courseContents ||= [];
    course.courseContents.push(courseContent);

    await this.dataSource.transaction(async (manager) => {
      await manager.save(courseContent);
      await manager.save(course);
    });

    return courseContent;
  }
}
