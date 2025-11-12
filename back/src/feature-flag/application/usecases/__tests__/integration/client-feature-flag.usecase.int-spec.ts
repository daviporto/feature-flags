import { PrismaClient } from '@prisma/client';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { faker } from '@faker-js/faker';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';
import { FeatureFlagPrismaTestingHelper } from '@/feature-flag/infrastructure/database/prisma/testing/feature-flag-prisma.testing-helper';
import { ClientFeatureFlagUsecase } from '../../client-feature-flag.usecase';

describe('Get client feature-flag usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: FeatureFlagPrismaRepository;
  let sut: ClientFeatureFlagUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new FeatureFlagPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ClientFeatureFlagUsecase.UseCase(repository);

    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await resetDatabase(prismaService);

    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when feature flag not found', () => {
    const id = faker.string.uuid();
    expect(() => sut.execute({ featureFlagId: id })).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError(id),
    );
  });

  it('should retrieve a feature flag', async () => {
    const featureFlag =
      await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService);

    const output = await sut.execute({ featureFlagId: featureFlag.id });

    expect(output).toBeDefined();
    expect(output).toMatchObject(featureFlag);
  });
});
