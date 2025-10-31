import {
  FeatureFlagValidator,
  FeatureFlagValidatorFactory,
} from '../../feature-flag.validator';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';

let sut: FeatureFlagValidator;

describe('FeatureFlagValidatorFields Unit Tests', () => {
  beforeEach(() => {
    sut = FeatureFlagValidatorFactory.create();
  });

  describe('name validation', () => {
    it('should return true with valid name', () => {
      const data = FeatureFlagDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.name).toStrictEqual(data.name);
    });

    it('Should validate without data', () => {
      const isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate name being null', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        name: null,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate name empty string', () => {
      const isValid = sut.validate({ ...FeatureFlagDataBuilder({}), name: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);
    });

    it('Should validate name being date instead of string', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        name: new Date() as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate name being greater than 255', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        name: 'a'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('description validation', () => {
    it('should return true with valid description', () => {
      const data = FeatureFlagDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.description).toStrictEqual(data.description);
    });

    it('Should validate without data', () => {
      const isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['description']).toStrictEqual([
        'description should not be empty',
        'description must be a string',
        'description must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate description being null', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        description: null,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['description']).toStrictEqual([
        'description should not be empty',
        'description must be a string',
        'description must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate description empty string', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        description: '',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['description']).toStrictEqual([
        'description should not be empty',
      ]);
    });

    it('Should validate description being date instead of string', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        description: new Date() as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['description']).toStrictEqual([
        'description must be a string',
        'description must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate description being greater than 255', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        description: 'a'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['description']).toStrictEqual([
        'description must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('enabled validation', () => {
    it('should return true with valid enabled flag', () => {
      const data = FeatureFlagDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.enabled).toStrictEqual(data.enabled);
    });

    it('Should validate true without enabled data', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        enabled: null,
      });

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.enabled).toBeNull();
    });

    it('Should validate enabled being string instead of boolean', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        enabled: 'true' as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['enabled']).toStrictEqual([
        'enabled must be a boolean value',
      ]);
    });

    it('Should validate enabled being number instead of boolean', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        enabled: 1 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['enabled']).toStrictEqual([
        'enabled must be a boolean value',
      ]);
    });
  });

  describe('userId validation', () => {
    it('should return true with valid userId', () => {
      const data = FeatureFlagDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.userId).toStrictEqual(data.userId);
    });

    it('Should validate without data', () => {
      const isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['userId']).toStrictEqual([
        'userId should not be empty',
        'userId must be a UUID',
      ]);
    });

    it('Should validate userId being null', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        userId: null,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['userId']).toStrictEqual([
        'userId should not be empty',
        'userId must be a UUID',
      ]);
    });

    it('Should validate userId empty string', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        userId: '',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['userId']).toStrictEqual([
        'userId should not be empty',
        'userId must be a UUID',
      ]);
    });

    it('Should validate userId being invalid UUID', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        userId: 'invalid-uuid',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['userId']).toStrictEqual(['userId must be a UUID']);
    });

    it('Should validate userId being number instead of string', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        userId: 123 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['userId']).toStrictEqual(['userId must be a UUID']);
    });
  });

  describe('createdAt validation', () => {
    it('should return true with valid date', () => {
      const data = FeatureFlagDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.createdAt).toStrictEqual(data.createdAt);
    });

    it('Should validate true without createdAt data', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        createdAt: null,
      });

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.createdAt).toBeNull();
    });

    it('Should validate createdAt being string instead of Date instance', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        createdAt: '2023-01-01' as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });

    it('Should validate createdAt being number instead of Date instance', () => {
      const isValid = sut.validate({
        ...FeatureFlagDataBuilder({}),
        createdAt: 1234567890 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });
  });
});
