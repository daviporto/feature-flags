import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-errors';

describe('FeatureFlag entity integration tests', () => {
  describe('Constructor tests', () => {
    it('should throw error with invalid name', () => {
      const props = {};

      expect(() => new FeatureFlagEntity(props as any)).toThrow(
        EntityValidationError,
      );
    });
  });
});
