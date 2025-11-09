import {
  UserFeatureFlagsEntity,
  UserFeatureFlagsProps,
} from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';

function commonAssertions(
  sut: UserFeatureFlagsEntity,
  props: UserFeatureFlagsProps,
) {
  expect(sut.featureFlagId).toBe(props.featureFlagId);
  expect(sut.userId).toBe(props.userId);
  expect(sut.enabled).toBe(props.enabled);
}

describe('UserFeatureFlags entity unit tests', () => {
  let sut: UserFeatureFlagsEntity;

  beforeEach(() => {
    UserFeatureFlagsEntity.validate = jest.fn();
  });

  it('should create a valid UserFeatureFlagsEntity', () => {
    const props = UserFeatureFlagsDataBuilder({});
    sut = new UserFeatureFlagsEntity(props);

    expect(sut).toBeInstanceOf(UserFeatureFlagsEntity);
    commonAssertions(sut, props);
  });

  it('should default enabled to true if not provided', () => {
    const props = UserFeatureFlagsDataBuilder({ enabled: undefined });
    sut = new UserFeatureFlagsEntity(props);

    expect(sut.enabled).toBe(true);
  });

  it('should use provided enabled value', () => {
    const props = UserFeatureFlagsDataBuilder({});
    props.enabled = false;
    sut = new UserFeatureFlagsEntity(props);

    expect(sut.enabled).toBe(false);
  });

  it('should have getters for all properties', () => {
    const props = UserFeatureFlagsDataBuilder({});
    sut = new UserFeatureFlagsEntity(props);

    expect(sut.featureFlagId).toBeDefined();
    expect(sut.userId).toBeDefined();
    expect(sut.enabled).toBeDefined();
    expect(sut.id).toBeDefined();
  });
});
