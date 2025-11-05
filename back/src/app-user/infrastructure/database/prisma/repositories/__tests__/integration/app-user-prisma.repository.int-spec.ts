import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { PrismaClient } from '@prisma/client';
import { AppUserPrismaRepository } from '@/app-user/infrastructure/database/prisma/repositories/app-user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { faker } from '@faker-js/faker';
import { AppUserWithIdNotFoundError } from '@/app-user/infrastructure/errors/app-user-with-id-not-found-error';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { AppUserPrismaTestingHelper } from '@/app-user/infrastructure/database/prisma/testing/app-user-prisma.testing-helper';

describe('AppUser prisma repository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: AppUserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new AppUserPrismaRepository(prismaService as any);
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when entity does not exist', async () => {
    const nonExistentId = faker.string.uuid();
    await expect(sut.findById(nonExistentId)).rejects.toThrow(
      new AppUserWithIdNotFoundError(nonExistentId),
    );
  });

  it('should find appUser by id', async () => {
    const appUserModel =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);
    const appUser = await sut.findById(appUserModel.id);

    expect(appUser).not.toBeNull();
    expect(appUser.id).toBe(appUserModel.id);
    expect(appUser.externalId).toBe(appUserModel.externalId);
    expect(appUser.email).toBe(appUserModel.email);
    expect(appUser.name).toBe(appUserModel.name);
    expect(appUser.createdAt).toEqual(appUserModel.createdAt);
  });

  it('should insert a new appUser', async () => {
    const props = AppUserDataBuilder({});
    const entity = new AppUserEntity(props);
    const result = await sut.insert(entity);

    expect(result).toBeInstanceOf(AppUserEntity);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();

    const createdAppUser = await prismaService.appUser.findUnique({
      where: { id: result.id },
    });

    expect(createdAppUser).not.toBeNull();
    expect(createdAppUser?.id).toBe(result.id);
    expect(createdAppUser?.externalId).toBe(entity.externalId);
    expect(createdAppUser?.email).toBe(entity.email);
    expect(createdAppUser?.name).toBe(entity.name);
  });

  it('should return all appUsers', async () => {
    const entity1 = new AppUserEntity(AppUserDataBuilder({}));
    const entity2 = new AppUserEntity(AppUserDataBuilder({}));

    await sut.insert(entity1);
    await sut.insert(entity2);

    const appUsers = await sut.findAll();

    expect(appUsers).toHaveLength(2);
    expect(appUsers[0].id).toBe(entity1.id);
    expect(appUsers[1].id).toBe(entity2.id);
  });

  it('should return one appUser if theres only one with find all', async () => {
    const entity = new AppUserEntity(AppUserDataBuilder({}));
    await sut.insert(entity);

    const appUsers = await sut.findAll();

    expect(appUsers).toHaveLength(1);
    expect(appUsers[0].id).toBe(entity.id);
  });

  it('should throw error when trying to update non-existent AppUser', async () => {
    const nonExistentId = faker.string.uuid();
    const entity = new AppUserEntity(
      {
        externalId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
      },
      nonExistentId,
    );

    await expect(sut.update(entity)).rejects.toThrow(
      new AppUserWithIdNotFoundError(nonExistentId),
    );
  });

  it('should update a AppUser successfully', async () => {
    const entity = new AppUserEntity(AppUserDataBuilder({}));
    const insertedEntity = await sut.insert(entity);

    const updatedExternalId = faker.string.uuid();
    const updatedEmail = faker.internet.email();
    const updatedName = faker.person.fullName();

    const updatedEntity = new AppUserEntity(
      {
        ...insertedEntity.props,
        externalId: updatedExternalId,
        email: updatedEmail,
        name: updatedName,
      },
      insertedEntity.id,
    );

    updatedEntity.update(updatedExternalId, updatedEmail, updatedName);

    await sut.update(updatedEntity);

    const foundUpdatedEntity = await prismaService.appUser.findUnique({
      where: { id: insertedEntity.id },
    });

    expect(foundUpdatedEntity).not.toBeNull();
    expect(foundUpdatedEntity?.id).toBe(insertedEntity.id);
    expect(foundUpdatedEntity?.externalId).toBe(updatedExternalId);
    expect(foundUpdatedEntity?.email).toBe(updatedEmail);
    expect(foundUpdatedEntity?.name).toBe(updatedName);
    expect(foundUpdatedEntity?.updatedAt).toBeDefined();
  });

  it('should throw error when trying to delete non-existent AppUser', async () => {
    const nonExistentId = faker.string.uuid();

    await expect(sut.delete(nonExistentId)).rejects.toThrow(
      new AppUserWithIdNotFoundError(nonExistentId),
    );
  });

  it('should delete a AppUser successfully', async () => {
    const entity = new AppUserEntity(AppUserDataBuilder({ name: 'John' }));
    await sut.insert(entity);

    await sut.delete(entity.id);

    const appUserCount = await prismaService.appUser.count({
      where: { id: entity.id },
    });

    expect(appUserCount).toBe(0);
  });

  describe('search tests', () => {
    it('should return with default values', async () => {
      const entity1 = new AppUserEntity(AppUserDataBuilder({ name: 'User 1' }));
      const entity2 = new AppUserEntity(AppUserDataBuilder({ name: 'User 2' }));
      const entity3 = new AppUserEntity(AppUserDataBuilder({ name: 'User 3' }));

      await sut.insert(entity1);
      await sut.insert(entity2);
      await sut.insert(entity3);

      const searchParams = new AppUserRepository.SearchParams();
      const result = await sut.search(searchParams);

      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.currentPage).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.sort).toBe('createdAt');
      expect(result.sortDir).toBe(SortOrderEnum.DESC);
      expect(result.filter).toBeNull();
    });

    it('should paginate appUsers', async () => {
      const entities = [];
      for (let i = 1; i <= 7; i++) {
        entities.push(
          new AppUserEntity(AppUserDataBuilder({ name: `User ${i}` })),
        );
      }

      for (const entity of entities) {
        await sut.insert(entity);
      }

      const searchParams = new AppUserRepository.SearchParams({
        page: 2,
        perPage: 3,
      });

      const result = await sut.search(searchParams);

      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(7);
      expect(result.currentPage).toBe(2);
      expect(result.perPage).toBe(3);
      expect(result.sort).toBe('createdAt');
      expect(result.sortDir).toBe(SortOrderEnum.DESC);
    });

    it('should filter appUsers by externalId', async () => {
      const externalId1 = faker.string.uuid();
      const externalId2 = faker.string.uuid();
      const externalId3 = faker.string.uuid();

      const entity1 = new AppUserEntity(
        AppUserDataBuilder({ externalId: externalId1, name: 'User 1' }),
      );
      const entity2 = new AppUserEntity(
        AppUserDataBuilder({ externalId: externalId2, name: 'User 2' }),
      );
      const entity3 = new AppUserEntity(
        AppUserDataBuilder({ externalId: externalId3, name: 'User 3' }),
      );

      await sut.insert(entity1);
      await sut.insert(entity2);
      await sut.insert(entity3);

      const searchParams = new AppUserRepository.SearchParams({
        filter: { externalId: externalId1 },
      });

      const result = await sut.search(searchParams);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.items[0].externalId).toBe(externalId1);
    });

    it('should filter appUsers by name', async () => {
      const entity1 = new AppUserEntity(
        AppUserDataBuilder({ name: 'John Doe' }),
      );
      const entity2 = new AppUserEntity(
        AppUserDataBuilder({ name: 'Jane Smith' }),
      );
      const entity3 = new AppUserEntity(
        AppUserDataBuilder({ name: 'John Smith' }),
      );

      await sut.insert(entity1);
      await sut.insert(entity2);
      await sut.insert(entity3);

      const searchParams = new AppUserRepository.SearchParams({
        filter: { name: 'John' },
      });

      const result = await sut.search(searchParams);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.items.every((item) => item.name.includes('John'))).toBe(
        true,
      );
    });

    it('should filter appUsers by email', async () => {
      const entity1 = new AppUserEntity(
        AppUserDataBuilder({ email: 'john1@example.com' }),
      );
      const entity2 = new AppUserEntity(
        AppUserDataBuilder({ email: 'jane@test.com' }),
      );
      const entity3 = new AppUserEntity(
        AppUserDataBuilder({ email: 'john2@test.com' }),
      );

      await sut.insert(entity1);
      await sut.insert(entity2);
      await sut.insert(entity3);

      const searchParams = new AppUserRepository.SearchParams({
        filter: { email: 'john' },
      });

      const result = await sut.search(searchParams);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.items.every((item) => item.email.includes('john'))).toBe(
        true,
      );
    });

    it('should sort appUsers by name', async () => {
      const entity1 = new AppUserEntity(
        AppUserDataBuilder({ name: 'Charlie' }),
      );
      const entity2 = new AppUserEntity(AppUserDataBuilder({ name: 'Alice' }));
      const entity3 = new AppUserEntity(AppUserDataBuilder({ name: 'Bob' }));

      await sut.insert(entity1);
      await sut.insert(entity2);
      await sut.insert(entity3);

      const searchParamsAsc = new AppUserRepository.SearchParams({
        sort: 'name',
        sortDir: SortOrderEnum.ASC,
      });

      const resultAsc = await sut.search(searchParamsAsc);

      expect(resultAsc.items[0].name).toBe('Alice');
      expect(resultAsc.items[1].name).toBe('Bob');
      expect(resultAsc.items[2].name).toBe('Charlie');

      const searchParamsDesc = new AppUserRepository.SearchParams({
        sort: 'name',
        sortDir: SortOrderEnum.DESC,
      });

      const resultDesc = await sut.search(searchParamsDesc);

      expect(resultDesc.items[0].name).toBe('Charlie');
      expect(resultDesc.items[1].name).toBe('Bob');
      expect(resultDesc.items[2].name).toBe('Alice');
    });
  });
});
