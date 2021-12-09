import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { ContextProvider } from '../common/providers/context.provider';
import type { UserEntity } from '../database/entities/user.entity';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const user = <UserEntity>request.user;
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
