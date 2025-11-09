import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-errors';

describe('UserFeatureFlags entity integration tests', () => {
  describe('Constructor tests', () => {
    it('should throw error with invalid featureFlagId (not UUID)', () => {
      const props = {
        ...UserFeatureFlagsDataBuilder({}),
        featureFlagId: 'invalid-uuid',
      };

      expect(() => new UserFeatureFlagsEntity(props)).toThrow(
        EntityValidationError,
      );
    });

    it('should throw error with invalid userId (not UUID)', () => {
      const props = {
        ...UserFeatureFlagsDataBuilder({}),
        userId: 'invalid-uuid',
      };

      expect(() => new UserFeatureFlagsEntity(props)).toThrow(
        EntityValidationError,
      );
    });
  });
});
