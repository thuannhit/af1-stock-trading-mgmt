import { HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants/role-type';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserDto } from './dto/user-dto';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<UserDto> {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException(id);
    }

    return user;
  }
}
