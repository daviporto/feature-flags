import { PrismaClient } from '@prisma/client';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { DeleteFeatureFlagUsecase } from '@/feature-flag/application/usecases/delete-feature-flag.usecase';

describe('Delete FeatureFlag usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: FeatureFlagPrismaRepository;
  let sut: DeleteFeatureFlagUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new FeatureFlagPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteFeatureFlagUsecase.UseCase(repository);
    await prismaService.feature_flag.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when featureflag not found', () => { });

  it('should delete a featureflag', async () => {
  });
});
