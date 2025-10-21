import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';

export type FeatureFlagOutput = {

}

export class FeatureFlagOutputMapper {
  static toOutput(entity: FeatureFlagEntity): FeatureFlagOutput {
    return entity.toJSON();
  }
}
