import { PrismaClient } from '@prisma/client';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { GetFeatureFlagUsecase } from '@/feature-flag/application/usecases/get-feature-flag.usecase';
import { faker } from '@faker-js/faker';

describe('Get feature-flag usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: FeatureFlagPrismaRepository;
  let sut: GetFeatureFlagUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new FeatureFlagPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new GetFeatureFlagUsecase.UseCase(repository);
    await prismaService.featureFlag.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when feature flag not found', () => {
    const id = faker.string.uuid();
    expect(() => sut.execute({ id })).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError(id),
    );
  });

  it('should retrieve a feature flag', async () => {
    const featureFlag = await prismaService.featureFlag.create({ data: FeatureFlagDataBuilder({}) });

    const output = await sut.execute({ id: featureFlag.id });

    expect(output).toBeDefined();
    expect(output).toMatchObject(featureFlag);
  });
});
