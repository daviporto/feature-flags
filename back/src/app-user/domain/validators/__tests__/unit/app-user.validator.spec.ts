import {
  AppUserValidator,
  AppUserValidatorFactory,
} from '@/app-user/domain/validators/app-user.validator';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';

let sut: AppUserValidator;

describe('AppUser Unit Tests', () => {
  beforeEach(() => {
    sut = AppUserValidatorFactory.create();
  });

  describe('name validation', () => {
    it('should return true with valid name', () => {
      const data = AppUserDataBuilder({});
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
      const isValid = sut.validate({ ...AppUserDataBuilder({}), name: null });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate name empty string', () => {
      const isValid = sut.validate({ ...AppUserDataBuilder({}), name: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);
    });

    it('Should validate name being date instead of string', () => {
      const isValid = sut.validate({
        ...AppUserDataBuilder({}),
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
        ...AppUserDataBuilder({}),
        name: 'a'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('externalId validation', () => {
    it('should return true with valid externalId', () => {
      const data = AppUserDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.externalId).toStrictEqual(data.externalId);
    });

    it('Should validate externalId being null', () => {
      const isValid = sut.validate({
        ...AppUserDataBuilder({}),
        externalId: null,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['externalId']).toStrictEqual([
        'externalId must be a string',
        'externalId should not be empty',
        'externalId must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate externalId empty string', () => {
      const isValid = sut.validate({
        ...AppUserDataBuilder({}),
        externalId: '',
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['externalId']).toStrictEqual([
        'externalId should not be empty',
      ]);
    });

    it('Should validate externalId being date instead of string', () => {
      const isValid = sut.validate({
        ...AppUserDataBuilder({}),
        externalId: new Date() as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['externalId']).toStrictEqual([
        'externalId must be a string',
        'externalId must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate externalId being greater than 255', () => {
      const isValid = sut.validate({
        ...AppUserDataBuilder({}),
        externalId: 'a'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['externalId']).toStrictEqual([
        'externalId must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('email validation', () => {
    it('should return true with valid email', () => {
      const data = AppUserDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.email).toStrictEqual(data.email);
    });

    it('Should validate without data', () => {
      const isValid = sut.validate(null);

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate email being null', () => {
      const isValid = sut.validate({ ...AppUserDataBuilder({}), email: null });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate email empty string', () => {
      const isValid = sut.validate({ ...AppUserDataBuilder({}), email: '' });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
      ]);
    });

    it('Should validate email being date instead of string', () => {
      const isValid = sut.validate({
        ...AppUserDataBuilder({}),
        email: new Date() as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('Should validate email being greater than 255', () => {
      const isValid = sut.validate({
        ...AppUserDataBuilder({}),
        email: 'a'.repeat(256),
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('createdAt validation', () => {
    it('should return true with valid date', () => {
      const data = AppUserDataBuilder({});
      const isValid = sut.validate(data);

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.createdAt).toStrictEqual(data.createdAt);
    });

    it('Should validate true without data', () => {
      const isValid = sut.validate({
        ...AppUserDataBuilder({}),
        createdAt: null,
      });

      expect(isValid).toBeTruthy();
      expect(sut.errors).toBeNull();
      expect(sut.validatedData.createdAt).toBeNull();
    });

    it('Should validate email being not an instanceOf date', () => {
      const isValid = sut.validate({
        ...AppUserDataBuilder({}),
        createdAt: 123 as any,
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors).toBeDefined();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });
  });
});
