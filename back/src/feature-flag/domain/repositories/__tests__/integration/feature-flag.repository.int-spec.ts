import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { PrismaClient } from '@prisma/client';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { faker } from '@faker-js/faker';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';
import { UserPrismaTestingHelper } from '@/user/infrastructure/database/prisma/testing/user-prisma.testing-helper';
import { FeatureFlagPrismaTestingHelper } from '@/feature-flag/infrastructure/database/prisma/testing/feature-flag-prisma.testing-helper';

describe('FeatureFlag prisma repository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: FeatureFlagPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new FeatureFlagPrismaRepository(prismaService as any);
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();

    await resetDatabase(prismaService);
  });

  it('should throw error when entity does not exist', () => {
    expect(() => sut.findById('1')).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError('1'),
    );
  });

  it('should find feature flag by id', async () => {
    const user =
      await UserPrismaTestingHelper.createUserAsEntity(prismaService);
    const entity = new FeatureFlagEntity(
      FeatureFlagDataBuilder({
        userId: user.id,
      }),
    );

    const createdFeatureFlag = await prismaService.featureFlag.create({
      data: entity.toJSON(),
    });

    const featureFlag = await sut.findById(createdFeatureFlag.id);

    expect(sut).not.toBeNull();
    expect(featureFlag.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should insert a new feature flag', async () => {
    const user =
      await UserPrismaTestingHelper.createUserAsEntity(prismaService);
    const entity = new FeatureFlagEntity(
      FeatureFlagDataBuilder({
        userId: user.id,
      }),
    );
    await sut.insert(entity);
  });

  it('should return one feature flag if theres only one with find all', async () => {
    const entity =
      await FeatureFlagPrismaTestingHelper.createFeatureFlagAsEntity(
        prismaService,
      );

    const featureFlags = await sut.findAll();

    expect(featureFlags).toHaveLength(1);
    expect(featureFlags[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throw error when trying to update non-existent feature flag', async () => {
    const nonExistentId = faker.string.uuid();
    const entity = new FeatureFlagEntity(
      FeatureFlagDataBuilder({}),
      nonExistentId,
    );

    await expect(sut.update(entity)).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError(nonExistentId),
    );
  });

  it('should update a feature flag successfully', async () => {});

  it('should throw error when trying to delete non-existent feature flag', async () => {
    const nonExistentId = faker.string.uuid();

    await expect(sut.delete(nonExistentId)).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError(nonExistentId),
    );
  });

  it('should delete a feature flag successfully', async () => {
    const entity =
      await FeatureFlagPrismaTestingHelper.createFeatureFlagAsEntity(
        prismaService,
      );

    await sut.delete(entity.id);

    const featureFlagCount = await prismaService.featureFlag.count({
      where: { id: entity.id },
    });

    expect(featureFlagCount).toBe(0);
  });
});
