import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLesson } from './dto/add-lesson.dto';
import genToken from 'src/utils/genToken';
import { InjectRepository } from '@nestjs/typeorm';
import { Lessons } from './entities/lessons.entity';
import { DataSource, Repository } from 'typeorm';
import { FileUpload } from './types';
import { ModulesService } from '../modules/modules.service';
import { UploadFile } from '../utils/file-upload.service';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lessons)
    private lessonRepo: Repository<Lessons>,
    private moduleService: ModulesService,
    private uploadFile: UploadFile,
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

    const { filename } = await content;

    return await this.dataSource.transaction(async (manager) => {
      const { token: id } = genToken();
      const Key = `${id.slice(-6)}-${filename}`;
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

      const { mediaUrl, duration } = await this.uploadFile.handleUpload(
        content,
        Key,
      );

      lesson.mediaURL = mediaUrl;
      if (duration) {
        const min = Math.floor(duration / 60);
        const sec = Math.floor(duration % 60);
        lesson.duration = `${min}min ${sec > 0 ? `${sec}sec` : ''}`;
      }

      lesson = await manager.save(lesson);

      return lesson;
    });
  }
}
