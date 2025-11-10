import { UserFeatureFlag } from '@prisma/client';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { ValidationErrors } from '@/shared/domain/errors/validation-errors';

export class UserFeatureFlagsModelMapper {
  static toEntity(model: UserFeatureFlag): UserFeatureFlagsEntity {
    const data = {
      featureFlagId: model.featureFlagId,
      userId: model.userId,
      enabled: model.enabled,
    };

    try {
      return new UserFeatureFlagsEntity(data, model.id);
    } catch {
      throw new ValidationErrors(
        `Could not load user-feature-flags having id ${model.id}`,
      );
    }
  }
}
