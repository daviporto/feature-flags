import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';

export type UserFeatureFlagsOutput = {
  id: string;
  featureFlagId: string;
  userId: string;
  enabled: boolean;
};

export class UserFeatureFlagsOutputMapper {
  static toOutput(entity: UserFeatureFlagsEntity): UserFeatureFlagsOutput {
    return entity.toJSON();
  }
}
