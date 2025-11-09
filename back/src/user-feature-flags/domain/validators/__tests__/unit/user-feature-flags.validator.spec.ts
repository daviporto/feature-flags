import {
  UserFeatureFlagsValidator,
  UserFeatureFlagsValidatorFactory,
} from '../../user-feature-flags.validator';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';

let sut: UserFeatureFlagsValidator;

describe('UserFeatureFlagsValidatorFields Unit Tests', () => {
  beforeEach(() => {
    sut = UserFeatureFlagsValidatorFactory.create();
  });

  it('should validate without data', () => {
    const isValid = sut.validate(null);

    expect(isValid).toBeFalsy();
    expect(sut.errors).toBeDefined();
  });

  it('should validate with valid data', () => {
    const props = UserFeatureFlagsDataBuilder({});
    const isValid = sut.validate(props);

    expect(isValid).toBeTruthy();
    expect(sut.errors).toBeNull();
  });

  it('should validate with invalid featureFlagId (not UUID)', () => {
    const props = UserFeatureFlagsDataBuilder({ featureFlagId: 'invalid-uuid' });
    const isValid = sut.validate(props);

    expect(isValid).toBeFalsy();
    expect(sut.errors).toBeDefined();
  });

  it('should validate with invalid userId (not UUID)', () => {
    const props = UserFeatureFlagsDataBuilder({});
    (props as any).userId = 'invalid-uuid';
    const isValid = sut.validate(props);

    expect(isValid).toBeFalsy();
    expect(sut.errors).toBeDefined();
  });

  it('should validate with missing featureFlagId', () => {
    const props = UserFeatureFlagsDataBuilder({});
    delete (props as any).featureFlagId;
    const isValid = sut.validate(props);

    expect(isValid).toBeFalsy();
    expect(sut.errors).toBeDefined();
  });

  it('should validate with missing userId', () => {
    const props = UserFeatureFlagsDataBuilder({});
    delete (props as any).userId;
    const isValid = sut.validate(props);

    expect(isValid).toBeFalsy();
    expect(sut.errors).toBeDefined();
  });
});
