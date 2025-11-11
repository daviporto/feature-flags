import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { UserFeatureFlagsOutputMapper } from '@/user-feature-flags/application/dtos/user-feature-flags-output';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';

describe('UserFeatureFlags output unit tests', () => {
  it('should convert a user-feature-flag entity to output', () => {
    const props = UserFeatureFlagsDataBuilder({});
    const entity = new UserFeatureFlagsEntity(props);
    const output = UserFeatureFlagsOutputMapper.toOutput(entity);

    expect(output).toBeDefined();
    expect(output.id).toBe(entity.id);
    expect(output.featureFlagId).toBe(entity.featureFlagId);
    expect(output.userId).toBe(entity.userId);
    expect(output.enabled).toBe(entity.enabled);
  });
});
