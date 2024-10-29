import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesResolver } from './modules.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as CourseModule } from './entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseModule])],
  providers: [ModulesResolver, ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
