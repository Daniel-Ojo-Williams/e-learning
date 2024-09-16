/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Args,
  Context,
  ID,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Users } from './entities/user.entity';
import { CreateUser } from './dto/create-user.dto';
import { LoginResponse, LoginUserDetails } from './dto/login-user.dto';
import { Public } from '../guards/auth.guard';
import { ParseUUIDPipe } from '@nestjs/common';
import { AuthPayload } from './Types';
import { ConfirmEmail } from './dto/confirm-email.dto';

@Resolver((_of) => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Users)
  async users(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.findOneById(id);
  }

  @Query((returns) => Users)
  async myProfile(@Context() context) {
    const user = context.$user as AuthPayload;
    return this.usersService.findOneById(user.sub);
  }

  @Public()
  @Mutation((returns) => String)
  async createUser(@Args('createUserDetails') createUserDetails: CreateUser) {
    await this.usersService.createUser(createUserDetails);
    return 'User created successfully';
  }

  @Public()
  @Mutation((returns) => LoginResponse)
  async loginUser(
    @Args('loginUserDetails') loginUserDetails: LoginUserDetails,
  ): Promise<LoginResponse> {
    return this.usersService.loginUser(loginUserDetails);
  }

  @Public()
  @Mutation((returns) => String)
  async confirmEmail(@Args('confirmEmail') confirmEmail: ConfirmEmail) {
    await this.usersService.confirmEmail(confirmEmail.token);
    return 'Account verification successful';
  }
}
