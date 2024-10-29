import { IsUUID } from 'class-validator';
import { CreateModuleInput } from './create-module.input';
import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateModuleInput extends PartialType(CreateModuleInput) {}

@ArgsType()
export class UpdateModuleArgs {
  @Field()
  @IsUUID()
  moduleId: string;

  updateModuleInput: UpdateModuleInput;
}
