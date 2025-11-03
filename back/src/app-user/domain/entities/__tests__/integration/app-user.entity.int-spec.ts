import { EntityValidationError } from '@/shared/domain/errors/validation-errors';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';

describe('AppUser entity integration tests', () => {
  it('should throw error with empty props', () => {
    const props = {};

    expect(() => new FeatureFlagEntity(props as any)).toThrow(
      EntityValidationError,
    );
  });
});
