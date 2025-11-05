import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserFakeBuilder } from '@/app-user/domain/fake-builder/app-user-fake.builder';

describe('AppUserFakeBuilder Unit Tests', () => {
  describe('name prop', () => {
    const faker = AppUserFakeBuilder.aAppUser();

    it('_name should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    it('withName()', () => {
      const appName = 'Introduction to Programming';
      const $this = faker.withName(appName);

      expect($this).toBeInstanceOf(AppUserFakeBuilder);
      expect(faker['_name']).toBe(appName);

      faker.withName(() => appName);

      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe(appName);

      expect(faker.name).toBe(appName);
    });

    it('should pass index to name factory', () => {
      faker.withName((index) => `AppUser ${index}`);
      const appUser = faker.build();

      expect(appUser.name).toBe('AppUser 0');

      const fakerMany = AppUserFakeBuilder.theAppUsers(2);
      fakerMany.withName((index) => `AppUser ${index}`);

      const appUsers = fakerMany.build();

      expect(appUsers[0].name).toBe('AppUser 0');
      expect(appUsers[1].name).toBe('AppUser 1');
    });
  });

  describe('externalId prop', () => {
    const faker = AppUserFakeBuilder.aAppUser();

    it('_externalId should be a function', () => {
      expect(typeof faker['_externalId']).toBe('function');
    });

    it('withExternalId()', () => {
      const externalId = 'external-id-1';
      const $this = faker.withExternalId(externalId);

      expect($this).toBeInstanceOf(AppUserFakeBuilder);
      expect(faker['_externalId']).toBe(externalId);

      faker.withExternalId(() => externalId);

      //@ts-expect-error externalId is callable
      expect(faker['_externalId']()).toBe(externalId);

      expect(faker.externalId).toBe(externalId);
    });

    it('should pass index to externalId factory', () => {
      faker.withExternalId((index) => `external-id-${index}`);
      const appUser = faker.build();

      expect(appUser.externalId).toBe('external-id-0');

      const fakerMany = AppUserFakeBuilder.theAppUsers(2);
      fakerMany.withExternalId((index) => `external-id-${index}`);

      const appUsers = fakerMany.build();

      expect(appUsers[0].externalId).toBe('external-id-0');
      expect(appUsers[1].externalId).toBe('external-id-1');
    });
  });

  describe('email prop', () => {
    const faker = AppUserFakeBuilder.aAppUser();

    it('_email should be a function', () => {
      expect(typeof faker['_email']).toBe('function');
    });

    it('withEmail()', () => {
      const email = 'test@example.com';
      const $this = faker.withEmail(email);

      expect($this).toBeInstanceOf(AppUserFakeBuilder);
      expect(faker['_email']).toBe(email);

      faker.withEmail(() => email);

      //@ts-expect-error email is callable
      expect(faker['_email']()).toBe(email);

      expect(faker.email).toBe(email);
    });

    it('should pass index to email factory', () => {
      faker.withEmail((index) => `test${index}@example.com`);
      const appUser = faker.build();

      expect(appUser.email).toBe('test0@example.com');

      const fakerMany = AppUserFakeBuilder.theAppUsers(2);
      fakerMany.withEmail((index) => `test${index}@example.com`);

      const appUsers = fakerMany.build();

      expect(appUsers[0].email).toBe('test0@example.com');
      expect(appUsers[1].email).toBe('test1@example.com');
    });
  });

  describe('createdAt prop', () => {
    const faker = AppUserFakeBuilder.aAppUser();

    test('should throw error when any with methods has been called', () => {
      const fakerAppUser = AppUserFakeBuilder.aAppUser();

      expect(() => fakerAppUser.createdAt).toThrow(
        new Error(
          "Property createdAt does not have a factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined', () => {
      expect(faker['_createdAt']).toBeUndefined();
    });

    test('withCreatedAt()', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);

      expect($this).toBeInstanceOf(AppUserFakeBuilder);
      expect(faker['_createdAt']).toBe(date);

      faker.withCreatedAt(() => date);

      //@ts-expect-error _createdAt is a callable
      expect(faker['_createdAt']()).toBe(date);
      expect(faker.createdAt).toBe(date);
    });

    test('should pass index to createdAt factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));

      const appUser = faker.build();
      expect(appUser.createdAt.getTime()).toBe(date.getTime() + 2);

      const fakerMany = AppUserFakeBuilder.theAppUsers(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const appUsers = fakerMany.build();

      expect(appUsers[0].createdAt.getTime()).toBe(date.getTime() + 2);
      expect(appUsers[1].createdAt.getTime()).toBe(date.getTime() + 3);
    });
  });

  describe('updatedAt prop', () => {
    const faker = AppUserFakeBuilder.aAppUser();

    test('should throw error when any with methods has been called', () => {
      const fakerAppUser = AppUserFakeBuilder.aAppUser();

      expect(() => fakerAppUser.updatedAt).toThrow(
        new Error(
          "Property updatedAt does not have a factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined', () => {
      expect(faker['_updatedAt']).toBeUndefined();
    });

    test('withUpdatedAt()', () => {
      const date = new Date();
      const $this = faker.withUpdatedAt(date);

      expect($this).toBeInstanceOf(AppUserFakeBuilder);
      expect(faker['_updatedAt']).toBe(date);

      faker.withUpdatedAt(() => date);

      //@ts-expect-error _updatedAt is a callable
      expect(faker['_updatedAt']()).toBe(date);
      expect(faker.updatedAt).toBe(date);
    });

    test('should pass index to updatedAt factory', () => {
      const date = new Date();
      faker.withUpdatedAt((index) => new Date(date.getTime() + index + 2));

      const appUser = faker.build();
      expect(appUser.updatedAt?.getTime()).toBe(date.getTime() + 2);

      const fakerMany = AppUserFakeBuilder.theAppUsers(2);
      fakerMany.withUpdatedAt((index) => new Date(date.getTime() + index + 2));
      const appUsers = fakerMany.build();

      expect(appUsers[0].updatedAt?.getTime()).toBe(date.getTime() + 2);
      expect(appUsers[1].updatedAt?.getTime()).toBe(date.getTime() + 3);
    });
  });

  describe('build() method', () => {
    it('should create a single app-user when count = 1', () => {
      const faker = AppUserFakeBuilder.aAppUser();
      const appUser = faker.build();

      expect(appUser).toBeInstanceOf(AppUserEntity);
      expect(appUser.externalId).toBeDefined();
      expect(appUser.email).toBeDefined();
      expect(appUser.name).toBeDefined();
    });

    it('should create multiple app-users when count > 1', () => {
      const count = 2;
      const faker = AppUserFakeBuilder.theAppUsers(count);
      const appUsers = faker.build();

      expect(appUsers).toHaveLength(count);
      expect(appUsers[0]).toBeInstanceOf(AppUserEntity);
      expect(appUsers[1]).toBeInstanceOf(AppUserEntity);
      expect(appUsers[0].externalId).not.toBe(appUsers[1].externalId);
    });
  });
});
