import { Injectable } from '@nestjs/common';
import type { FindConditions } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import { FileNotImageException } from '../../common/exceptions/file-not-image.exception';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import type { UserEntity } from '../../database/entities/user.entity';
import { UserRepository } from '../../database/repositories/user.repository';
import type { IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { Optional } from '../../types';
import type { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import type { UserDto } from './dto/user-dto';
import type { UsersPageOptionsDto } from './dto/users-page-options.dto';

@Injectable()
export class UserService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly validatorService: ValidatorService,
    public readonly awsS3Service: AwsS3Service,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindConditions<UserEntity>): Promise<Optional<UserEntity>> {
    return this.userRepository.findOne(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string; id: string }>,
  ): Promise<Optional<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    if (options.id) {
      queryBuilder.orWhere('user.id = :id', {
        id: options.id,
      });
    }

    return queryBuilder.getOne();
  }

  async createUser(
    userRegisterDto: UserRegisterDto,
    file: IFile,
  ): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.awsS3Service.uploadImage(file);
    }

    return this.userRepository.save(user);
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: string): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }
}
