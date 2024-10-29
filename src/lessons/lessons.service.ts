import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLesson } from './dto/add-lesson.dto';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import genToken from 'src/utils/genToken';
import { InjectRepository } from '@nestjs/typeorm';
import { Lessons } from './entities/lessons.entity';
import { Repository } from 'typeorm';
import { FileUpload } from 'graphql-upload';
import { ConfigService } from '@nestjs/config';
import { ModulesService } from 'src/modules/modules.service';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lessons)
    private lessonRepo: Repository<Lessons>,
    private moduleService: ModulesService,
    private config: ConfigService,
  ) {}

  async createLesson(
    { description, sequenceNumber, title, moduleId }: CreateLesson,
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

    const module = await this.moduleService.findOneModule(moduleId);

    if (!module)
      throw new NotFoundException(
        'Module not found, please check and try again',
      );

    const lesson = this.lessonRepo.create({
      description,
      sequenceNumber,
      uploadKey: Key,
      module,
      title,
    });

    return await this.lessonRepo.save(lesson);
  }
}
