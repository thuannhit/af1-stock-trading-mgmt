import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { UtilsProvider } from '../../common/providers/utils.provider';
import { UserEntity } from '../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    if (event.entity.password) {
      event.entity.password = UtilsProvider.generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void {
    if (event.entity!.password !== event.databaseEntity.password) {
      event.entity!.password = UtilsProvider.generateHash(
        event.entity!.password,
      );
    }
  }
}
