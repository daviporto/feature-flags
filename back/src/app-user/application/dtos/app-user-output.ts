import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';

export type AppUserOutput = {
  id: string;
  name: string;
  email: string;
  externalId: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export class AppUserOutputMapper {
  static toOutput(entity: AppUserEntity): AppUserOutput {
    return entity.toJSON();
  }
}
