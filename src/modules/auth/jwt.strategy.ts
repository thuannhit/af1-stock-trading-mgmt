import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { RoleType } from '../../constants/role-type';
import { TokenType } from '../../constants/token-type';
import type { UserEntity } from '../../database/entities/user.entity';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ApiConfigService,
    public readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.jwtSecret,
    });
  }

  async validate(args: {
    userId: string;
    role: RoleType;
    type: TokenType;
  }): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({
      id: args.userId,
      role: args.role,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
