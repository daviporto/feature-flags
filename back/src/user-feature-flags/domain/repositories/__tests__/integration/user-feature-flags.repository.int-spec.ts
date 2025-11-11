import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';
import { PrismaClient } from '@prisma/client';
import { UserFeatureFlagsPrismaRepository } from '@/user-feature-flags/infrastructure/database/prisma/repositories/user-feature-flags-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { faker } from '@faker-js/faker';
import { UserFeatureFlagsWithIdNotFoundError } from '@/user-feature-flags/infrastructure/errors/user-feature-flags-with-id-not-found-error';
import { UserFeatureFlagPrismaTestingHelper } from '@/user-feature-flags/infrastructure/database/prisma/testing/user-feature-flag-prisma.testing-helper';
import { FeatureFlagPrismaTestingHelper } from '@/feature-flag/infrastructure/database/prisma/testing/feature-flag-prisma.testing-helper';

describe('UserFeatureFlags prisma repository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserFeatureFlagsPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserFeatureFlagsPrismaRepository(prismaService as any);
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when entity does not exist', () => {
    expect(() => sut.findById('1')).rejects.toThrow(
      new UserFeatureFlagsWithIdNotFoundError('1'),
    );
  });

  it('should find user-feature-flags by id', async () => {
    const entity =
      await UserFeatureFlagPrismaTestingHelper.createUserFeatureFlagAsEntity(
        prismaService,
      );

    const userFeatureFlag = await sut.findById(entity.id);

    expect(sut).not.toBeNull();
    expect(userFeatureFlag.id).toBe(entity.id);
    expect(userFeatureFlag.featureFlagId).toBe(entity.featureFlagId);
    expect(userFeatureFlag.userId).toBe(entity.userId);
    expect(userFeatureFlag.enabled).toBe(entity.enabled);
  });

  it('should insert a new user-feature-flags', async () => {
    const entity =
      await UserFeatureFlagPrismaTestingHelper.createUserFeatureFlagAsEntity(
        prismaService,
      );
    const newFeatureFlag =
      await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService);
    const newEntity = new UserFeatureFlagsEntity(
      UserFeatureFlagsDataBuilder({
        featureFlagId: newFeatureFlag.id,
        userId: entity.userId,
      }),
    );
    await sut.insert(newEntity);
  });

  it('should return one user-feature-flags if theres only one with find all', async () => {
    const entity =
      await UserFeatureFlagPrismaTestingHelper.createUserFeatureFlagAsEntity(
        prismaService,
      );
    // Entity is already inserted by the helper, so we just verify it exists

    const userFeatureFlag = await sut.findAll();

    expect(userFeatureFlag).toHaveLength(1);
    expect(userFeatureFlag[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throw error when trying to update non-existent user-feature-flags', async () => {
    const nonExistentId = faker.string.uuid();
    const entity = new UserFeatureFlagsEntity(
      UserFeatureFlagsDataBuilder({}),
      nonExistentId,
    );

    await expect(sut.update(entity)).rejects.toThrow(
      new UserFeatureFlagsWithIdNotFoundError(nonExistentId),
    );
  });

  it('should update a user-feature-flags successfully', async () => {});

  it('should throw error when trying to delete non-existent user-feature-flags', async () => {
    const nonExistentId = faker.string.uuid();

    await expect(sut.delete(nonExistentId)).rejects.toThrow(
      new UserFeatureFlagsWithIdNotFoundError(nonExistentId),
    );
  });

  it('should delete a user-feature-flags successfully', async () => {
    const entity =
      await UserFeatureFlagPrismaTestingHelper.createUserFeatureFlagAsEntity(
        prismaService,
      );

    await sut.delete(entity.id);

    const userFeatureFlagCount = await prismaService.userFeatureFlag.count({
      where: { id: entity.id },
    });

    expect(userFeatureFlagCount).toBe(0);
  });
});
