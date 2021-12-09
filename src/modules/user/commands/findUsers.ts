import { Injectable } from '@nestjs/common';
import type { FindConditions } from 'typeorm';

import type { PageDto } from '../../../common/dto/page.dto';
import type { UserDto } from '../dto/user-dto';
import type { UsersPageOptionsDto } from '../dto/users-page-options.dto';
import { UserService } from '../user.service';

@Injectable()
export class FindUsersUseCase {
  constructor(private userService: UserService) {}

  handle(pageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }
}
