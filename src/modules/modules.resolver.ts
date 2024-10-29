import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { CreateModuleInput } from './dto/create-module.input';
import { UpdateModuleArgs } from './dto/update-module.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => Module)
export class ModulesResolver {
  constructor(private readonly modulesService: ModulesService) {}

  @Mutation(() => Module)
  async createModule(
    @Args('createModuleInput') createModuleInput: CreateModuleInput,
  ) {
    return this.modulesService.create(createModuleInput);
  }

  @Query(() => Module, { name: 'module' })
  async findOne(
    @Args('moduleId', { description: 'Returns a single module' }, ParseUUIDPipe)
    moduleId: string,
  ) {
    return this.modulesService.findOneModule(moduleId);
  }

  @Mutation(() => Module)
  async updateModule(@Args() args: UpdateModuleArgs) {
    const { moduleId, updateModuleInput } = args;
    this.modulesService.update(moduleId, updateModuleInput);
  }

  @Mutation(() => Boolean)
  async removeModule(@Args('moduleId', ParseUUIDPipe) moduleId: string) {
    this.modulesService.removeModule(moduleId);
    return true;
  }
}
