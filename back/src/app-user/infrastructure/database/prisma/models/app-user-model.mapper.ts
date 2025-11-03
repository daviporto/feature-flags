import { AppUser } from '@prisma/client';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { ValidationErrors } from '@/shared/domain/errors/validation-errors';

export class AppUserModelMapper {
  static toEntity(model: AppUser): AppUserEntity {
    const data = {
      externalId: model.externalId,
      email: model.email,
      name: model.name,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };

    try {
      return new AppUserEntity(data, model.id);
    } catch {
      throw new ValidationErrors(
        `Could not load appUser having id ${model.id}`,
      );
    }
  }
}
