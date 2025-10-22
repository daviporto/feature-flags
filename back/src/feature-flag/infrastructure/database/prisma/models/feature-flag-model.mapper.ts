import { FeatureFlag } from '@prisma/client';
import {FeatureFlagEntity, FeatureFlagProps} from '@/feature-flag/domain/entities/feature-flag.entity';
import { ValidationErrors } from '@/shared/domain/errors/validation-errors';

export class FeatureFlagModelMapper {
  static toEntity(model: FeatureFlag): FeatureFlagEntity {
    const data = {
      name: model.name,
      description: model.description,
      enabled: model.enabled,
      userId: model.userId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    } as FeatureFlagProps;

    try {
      return new FeatureFlagEntity(data, model.id);
    } catch {
      throw new ValidationErrors(`Could not load feature flag having id ${model.id}`);
    }
  }
}
