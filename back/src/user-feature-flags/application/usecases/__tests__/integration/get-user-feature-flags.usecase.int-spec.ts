import { PrismaClient } from '@prisma/client';
import { UserFeatureFlagsPrismaRepository } from '@/user-feature-flags/infrastructure/database/prisma/repositories/user-feature-flags-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { GetUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/get-user-feature-flags.usecase';
import { faker } from '@faker-js/faker';
import { UserFeatureFlagsWithIdNotFoundError } from '@/user-feature-flags/infrastructure/errors/user-feature-flags-with-id-not-found-error';
import { UserFeatureFlagPrismaTestingHelper } from '@/user-feature-flags/infrastructure/database/prisma/testing/user-feature-flag-prisma.testing-helper';

describe('Get user-feature-flags usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserFeatureFlagsPrismaRepository;
  let sut: GetUserFeatureFlagsUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserFeatureFlagsPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new GetUserFeatureFlagsUsecase.UseCase(repository);
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when user-feature-flags not found', () => {
    const id = faker.string.uuid();
    expect(() => sut.execute({ id })).rejects.toThrow(
      new UserFeatureFlagsWithIdNotFoundError(id),
    );
  });

  it('should retrieve a user-feature-flags', async () => {
    const userFeatureFlag =
      await UserFeatureFlagPrismaTestingHelper.createUserFeatureFlagAsEntity(
        prismaService,
      );

    const output = await sut.execute({ id: userFeatureFlag.id });

    expect(output).toBeDefined();
    expect(output.id).toBe(userFeatureFlag.id);
    expect(output.featureFlagId).toBe(userFeatureFlag.featureFlagId);
    expect(output.userId).toBe(userFeatureFlag.userId);
    expect(output.enabled).toBe(userFeatureFlag.enabled);
  });
});
