import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleInput } from './dto/create-module.input';
import { UpdateModuleInput } from './dto/update-module.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from './entities/module.entity';
import { Repository } from 'typeorm';
import { Courses } from '../courses/entities/courses.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module) private readonly modulesRepo: Repository<Module>,
    @InjectRepository(Courses)
    private readonly coursesRepo: Repository<Courses>,
  ) {}

  async create(createModuleInput: CreateModuleInput) {
    const { courseId } = createModuleInput;
    const course = await this.coursesRepo.findOneBy({ id: courseId });
    if (!course) throw new NotFoundException('Course not found');
    const module = this.modulesRepo.create(createModuleInput);
    module.course = course;
    return this.modulesRepo.save(module);
  }

  async findAllCourseModules(courseId: string) {
    const modules = await this.modulesRepo.find({
      where: { course: { id: courseId } },
    });

    return modules;
  }

  async findOneModule(moduleId: string) {
    const module = await this.modulesRepo.findOneBy({ id: moduleId });

    if (!module) throw new NotFoundException('Module not found');

    return module;
  }

  async update(moduleId: string, updateModuleInput: UpdateModuleInput) {
    const module = await this.modulesRepo.findOneBy({ id: moduleId });

    if (!module) throw new NotFoundException('Module not found');

    const updatedModule: Module = Object.assign(module, updateModuleInput);

    return this.modulesRepo.save(updatedModule);
  }

  async removeModule(moduleId: string) {
    const module = await this.modulesRepo.delete({ id: moduleId });
    if (!module) throw new NotFoundException('Module not found');
  }
}
