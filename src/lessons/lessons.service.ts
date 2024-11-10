import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLesson } from './dto/add-lesson.dto';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import genToken from 'src/utils/genToken';
import { InjectRepository } from '@nestjs/typeorm';
import { Lessons } from './entities/lessons.entity';
import { DataSource, Repository } from 'typeorm';
import { FileUpload } from './types';
import { ConfigService } from '@nestjs/config';
import { ModulesService } from 'src/modules/modules.service';
import { EnvVariables } from 'src/config/validateEnv';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lessons)
    private lessonRepo: Repository<Lessons>,
    private moduleService: ModulesService,
    private config: ConfigService<EnvVariables, true>,
    private dataSource: DataSource,
  ) {}

  async createLesson(
    { description, sequenceNumber, title, moduleId, type }: CreateLesson,
    content: Promise<FileUpload>,
  ) {
    const module = await this.moduleService.findOneModule(moduleId);

    if (!module)
      throw new NotFoundException(
        'Module not found, please check and try again',
      );

    const { createReadStream, filename } = await content;

    const s3 = new S3Client({
      region: this.config.get('S3_REGION'),
      credentials: {
        accessKeyId: this.config.get('S3_ACCESSKEYID'),
        secretAccessKey: this.config.get('S3_ACCESSKEYSECRET'),
      },
    });

    return await this.dataSource.transaction(async (manager) => {
      const { token: id } = genToken();
      const Key = `${id.slice(-8)}-${filename}`;
      let lesson = this.lessonRepo.create({
        description,
        sequenceNumber,
        module,
        title,
        mediaURL: '',
        uploadKey: Key,
        type,
      });

      lesson = await manager.save(lesson);

      const upload = new Upload({
        client: s3,
        params: {
          Bucket: 'd-e-learning',
          Key,
          Body: createReadStream(),
        },
      });

      const { Location } = await upload.done();

      lesson.mediaURL = Location;

      lesson = await manager.save(lesson);

      return lesson;
    });
  }
}
