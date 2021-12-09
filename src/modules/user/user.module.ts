import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../../database/repositories/user.repository';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserResolver],
})
export class UserModule {}
