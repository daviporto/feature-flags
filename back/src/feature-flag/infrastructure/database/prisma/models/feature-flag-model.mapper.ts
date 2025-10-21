import { FeatureFlag } from '@prisma/client';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { ValidationErrors } from '@/shared/domain/errors/validation-errors';

export class FeatureFlagModelMapper {
  static toEntity(model: FeatureFlag): FeatureFlagEntity {
    const data = { };

    try {
      return new FeatureFlagEntity(data, model.id);
    } catch {
      throw new ValidationErrors(`Could not load feature-flag having id ${model.id}`);
    }
  }
}
