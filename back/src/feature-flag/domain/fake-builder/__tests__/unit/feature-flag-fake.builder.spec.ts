import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagFakeBuilder } from '@/feature-flag/domain/fake-builder/feature-flag-fake.builder';
import { randomUUID } from 'node:crypto';

describe('FeatureFlagFakeBuilder Unit Tests', () => {
  describe('name prop', () => {
    const faker = FeatureFlagFakeBuilder.aFeatureFlag();

    it('_name should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    it('withName()', () => {
      const featureFlagName = 'new-feature-flag';
      const $this = faker.withName(featureFlagName);

      expect($this).toBeInstanceOf(FeatureFlagFakeBuilder);
      expect(faker['_name']).toBe(featureFlagName);

      faker.withName(() => featureFlagName);

      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe(featureFlagName);

      expect(faker.name).toBe(featureFlagName);
    });

    it('should pass index to name factory', () => {
      faker.withName((index) => `FeatureFlag ${index}`);
      const featureFlag = faker.build();

      expect(featureFlag.name).toBe('FeatureFlag 0');

      const fakerMany = FeatureFlagFakeBuilder.theFeatureFlags(2);
      fakerMany.withName((index) => `FeatureFlag ${index}`);

      const featureFlags = fakerMany.build();

      expect(featureFlags[0].name).toBe('FeatureFlag 0');
      expect(featureFlags[1].name).toBe('FeatureFlag 1');
    });
  });

  describe('description prop', () => {
    const faker = FeatureFlagFakeBuilder.aFeatureFlag();

    it('_description should be a function', () => {
      expect(typeof faker['_description']).toBe('function');
    });

    it('withDescription()', () => {
      const featureFlagDescription = 'Feature flag description';
      const $this = faker.withDescription(featureFlagDescription);

      expect($this).toBeInstanceOf(FeatureFlagFakeBuilder);
      expect(faker['_description']).toBe(featureFlagDescription);

      faker.withDescription(() => featureFlagDescription);

      //@ts-expect-error description is callable
      expect(faker['_description']()).toBe(featureFlagDescription);

      expect(faker.description).toBe(featureFlagDescription);
    });

    it('should pass index to description factory', () => {
      faker.withDescription((index) => `Description ${index}`);
      const featureFlag = faker.build();

      expect(featureFlag.description).toBe('Description 0');

      const fakerMany = FeatureFlagFakeBuilder.theFeatureFlags(2);
      fakerMany.withDescription((index) => `Description ${index}`);

      const featureFlags = fakerMany.build();

      expect(featureFlags[0].description).toBe('Description 0');
      expect(featureFlags[1].description).toBe('Description 1');
    });
  });

  describe('enabled prop', () => {
    const faker = FeatureFlagFakeBuilder.aFeatureFlag();

    it('_enabled should be a function', () => {
      expect(typeof faker['_enabled']).toBe('function');
    });

    it('withEnabled()', () => {
      const featureFlagEnabled = true;
      const $this = faker.withEnabled(featureFlagEnabled);

      expect($this).toBeInstanceOf(FeatureFlagFakeBuilder);
      expect(faker['_enabled']).toBe(featureFlagEnabled);

      faker.withEnabled(() => featureFlagEnabled);

      //@ts-expect-error enabled is callable
      expect(faker['_enabled']()).toBe(featureFlagEnabled);

      expect(faker.enabled).toBe(featureFlagEnabled);
    });

    it('should pass index to enabled factory', () => {
      faker.withEnabled((index) => index % 2 === 0);
      const featureFlag = faker.build();

      expect(featureFlag.enabled).toBe(true);

      const fakerMany = FeatureFlagFakeBuilder.theFeatureFlags(3);
      fakerMany.withEnabled((index) => index % 2 === 0);

      const featureFlags = fakerMany.build();

      expect(featureFlags[0].enabled).toBe(true);
      expect(featureFlags[1].enabled).toBe(false);
      expect(featureFlags[2].enabled).toBe(true);
    });
  });

  describe('userId prop', () => {
    const faker = FeatureFlagFakeBuilder.aFeatureFlag();

    it('_userId should be a function', () => {
      expect(typeof faker['_userId']).toBe('function');
    });

    it('withUserId()', () => {
      const featureFlagUserId = randomUUID();
      const $this = faker.withUserId(featureFlagUserId);

      expect($this).toBeInstanceOf(FeatureFlagFakeBuilder);
      expect(faker['_userId']).toBe(featureFlagUserId);

      faker.withUserId(() => featureFlagUserId);

      //@ts-expect-error userId is callable
      expect(faker['_userId']()).toBe(featureFlagUserId);

      expect(faker.userId).toBe(featureFlagUserId);
    });
  });

  describe('createdAt prop', () => {
    const faker = FeatureFlagFakeBuilder.aFeatureFlag();
    test('should be undefined', () => {
      expect(faker['_createdAt']).toBeUndefined();
    });

    test('withCreatedAt()', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);

      expect($this).toBeInstanceOf(FeatureFlagFakeBuilder);
      expect(faker['_createdAt']).toBe(date);

      faker.withCreatedAt(() => date);

      //@ts-expect-error _createdAt is a callable
      expect(faker['_createdAt']()).toBe(date);
      expect(faker.createdAt).toBe(date);
    });

    test('should pass index to createdAt factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));

      const featureFlag = faker.build();
      expect(featureFlag.createdAt.getTime()).toBe(date.getTime() + 2);

      const fakerMany = FeatureFlagFakeBuilder.theFeatureFlags(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const featureFlags = fakerMany.build();

      expect(featureFlags[0].createdAt.getTime()).toBe(date.getTime() + 2);
      expect(featureFlags[1].createdAt.getTime()).toBe(date.getTime() + 3);
    });
  });

  describe('updatedAt prop', () => {
    const faker = FeatureFlagFakeBuilder.aFeatureFlag();

    test('should be undefined', () => {
      expect(faker['_updatedAt']).toBeUndefined();
    });

    test('withUpdatedAt()', () => {
      const date = new Date();
      const $this = faker.withUpdatedAt(date);

      expect($this).toBeInstanceOf(FeatureFlagFakeBuilder);
      expect(faker['_updatedAt']).toBe(date);

      faker.withUpdatedAt(() => date);

      //@ts-expect-error _updatedAt is a callable
      expect(faker['_updatedAt']()).toBe(date);
      expect(faker.updatedAt).toBe(date);
    });
  });

  describe('build() method', () => {
    it('should create a single feature flag when count = 1', () => {
      const faker = FeatureFlagFakeBuilder.aFeatureFlag();
      const featureFlag = faker.build();

      expect(featureFlag).toBeInstanceOf(FeatureFlagEntity);
      expect(featureFlag.name).toBeDefined();
      expect(featureFlag.description).toBeDefined();
      expect(featureFlag.enabled).toBeDefined();
      expect(featureFlag.userId).toBeDefined();
      expect(featureFlag.createdAt).toBeDefined();
    });

    it('should create multiple feature flags when count > 1', () => {
      const count = 2;
      const faker = FeatureFlagFakeBuilder.theFeatureFlags(count);
      const featureFlags = faker.build();

      expect(featureFlags).toHaveLength(count);
      expect(featureFlags[0]).toBeInstanceOf(FeatureFlagEntity);
      expect(featureFlags[1]).toBeInstanceOf(FeatureFlagEntity);
      expect(featureFlags[0].name).not.toBe(featureFlags[1].name);
      expect(featureFlags[0].userId).not.toBe(featureFlags[1].userId);
    });

    it('should create feature flag without createdAt and updatedAt when not provided', () => {
      const faker = FeatureFlagFakeBuilder.aFeatureFlag();
      const featureFlag = faker.build();

      expect(featureFlag.createdAt).toBeDefined();
      expect(featureFlag.createdAt).toBeInstanceOf(Date);
    });

    it('should create feature flag with custom createdAt and updatedAt', () => {
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');

      const faker = FeatureFlagFakeBuilder.aFeatureFlag()
        .withCreatedAt(createdAt)
        .withUpdatedAt(updatedAt);

      const featureFlag = faker.build();

      expect(featureFlag.createdAt).toBe(createdAt);
    });
  });
});
