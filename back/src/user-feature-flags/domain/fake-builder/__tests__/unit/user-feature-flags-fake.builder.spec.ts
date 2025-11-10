import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { UserFeatureFlagsFakeBuilder } from '@/user-feature-flags/domain/fake-builder/user-feature-flags-fake.builder';
import { faker } from '@faker-js/faker';

describe('UserFeatureFlagsFakeBuilder Unit Tests', () => {
  describe('featureFlagId prop', () => {
    const builder = UserFeatureFlagsFakeBuilder.aUserFeatureFlags();

    it('_featureFlagId should be a function', () => {
      expect(typeof builder['_featureFlagId']).toBe('function');
    });

    it('withFeatureFlagId()', () => {
      const featureFlagId = 'test-feature-flag-id';
      const $this = builder.withFeatureFlagId(featureFlagId);

      expect($this).toBeInstanceOf(UserFeatureFlagsFakeBuilder);
      expect(builder['_featureFlagId']).toBe(featureFlagId);

      builder.withFeatureFlagId(() => featureFlagId);

      //@ts-expect-error _featureFlagId is callable
      expect(builder['_featureFlagId']()).toBe(featureFlagId);

      expect(builder.featureFlagId).toBe(featureFlagId);
    });

    it('should pass index to featureFlagId factory', () => {
      const uuid1 = faker.string.uuid();
      const uuid2 = faker.string.uuid();
      builder.withFeatureFlagId((index) => (index === 0 ? uuid1 : uuid2));
      const userFeatureFlag = builder.build();

      expect(userFeatureFlag.featureFlagId).toBe(uuid1);

      const uuid3 = faker.string.uuid();
      const uuid4 = faker.string.uuid();
      const builderMany = UserFeatureFlagsFakeBuilder.theUserFeatureFlags(2);
      builderMany.withFeatureFlagId((index) => (index === 0 ? uuid3 : uuid4));

      const userFeatureFlags = builderMany.build();

      expect(userFeatureFlags[0].featureFlagId).toBe(uuid3);
      expect(userFeatureFlags[1].featureFlagId).toBe(uuid4);
    });
  });

  describe('userId prop', () => {
    const builder = UserFeatureFlagsFakeBuilder.aUserFeatureFlags();

    it('_userId should be a function', () => {
      expect(typeof builder['_userId']).toBe('function');
    });

    it('withUserId()', () => {
      const userId = 'test-user-id';
      const $this = builder.withUserId(userId);

      expect($this).toBeInstanceOf(UserFeatureFlagsFakeBuilder);
      expect(builder['_userId']).toBe(userId);

      builder.withUserId(() => userId);

      //@ts-expect-error _userId is callable
      expect(builder['_userId']()).toBe(userId);

      expect(builder.userId).toBe(userId);
    });

    it('should pass index to userId factory', () => {
      const uuid1 = faker.string.uuid();
      const uuid2 = faker.string.uuid();
      builder.withUserId((index) => (index === 0 ? uuid1 : uuid2));
      const userFeatureFlag = builder.build();

      expect(userFeatureFlag.userId).toBe(uuid1);

      const uuid3 = faker.string.uuid();
      const uuid4 = faker.string.uuid();
      const builderMany = UserFeatureFlagsFakeBuilder.theUserFeatureFlags(2);
      builderMany.withUserId((index) => (index === 0 ? uuid3 : uuid4));

      const userFeatureFlags = builderMany.build();

      expect(userFeatureFlags[0].userId).toBe(uuid3);
      expect(userFeatureFlags[1].userId).toBe(uuid4);
    });
  });

  describe('enabled prop', () => {
    const builder = UserFeatureFlagsFakeBuilder.aUserFeatureFlags();

    it('_enabled should be a function', () => {
      expect(typeof builder['_enabled']).toBe('function');
    });

    it('withEnabled()', () => {
      const enabled = false;
      const $this = builder.withEnabled(enabled);

      expect($this).toBeInstanceOf(UserFeatureFlagsFakeBuilder);
      expect(builder['_enabled']).toBe(enabled);

      builder.withEnabled(() => enabled);

      //@ts-expect-error _enabled is callable
      expect(builder['_enabled']()).toBe(enabled);

      expect(builder.enabled).toBe(enabled);
    });

    it('should pass index to enabled factory', () => {
      builder.withEnabled((index) => index % 2 === 0);
      const userFeatureFlag = builder.build();

      expect(userFeatureFlag.enabled).toBe(true);

      const builderMany = UserFeatureFlagsFakeBuilder.theUserFeatureFlags(2);
      builderMany.withEnabled((index) => index % 2 === 0);

      const userFeatureFlags = builderMany.build();

      expect(userFeatureFlags[0].enabled).toBe(true);
      expect(userFeatureFlags[1].enabled).toBe(false);
    });
  });

  describe('build() method', () => {
    it('should create a single user-feature-flag when count = 1', () => {
      const faker = UserFeatureFlagsFakeBuilder.aUserFeatureFlags();
      const userFeatureFlag = faker.build();

      expect(userFeatureFlag).toBeInstanceOf(UserFeatureFlagsEntity);
      expect(userFeatureFlag.featureFlagId).toBeDefined();
      expect(userFeatureFlag.userId).toBeDefined();
      expect(userFeatureFlag.enabled).toBeDefined();
    });

    it('should create multiple user-feature-flags when count > 1', () => {
      const count = 2;
      const faker = UserFeatureFlagsFakeBuilder.theUserFeatureFlags(count);
      const userFeatureFlags = faker.build();

      expect(userFeatureFlags).toHaveLength(count);
      expect(userFeatureFlags[0]).toBeInstanceOf(UserFeatureFlagsEntity);
      expect(userFeatureFlags[1]).toBeInstanceOf(UserFeatureFlagsEntity);
      expect(userFeatureFlags[0].featureFlagId).not.toBe(
        userFeatureFlags[1].featureFlagId,
      );
    });
  });
});
