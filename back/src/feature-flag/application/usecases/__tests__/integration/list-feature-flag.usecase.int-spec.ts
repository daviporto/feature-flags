import { PrismaClient } from '@prisma/client';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';

describe('List featureflags usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: FeatureFlagPrismaRepository;
  let sut: ListFeatureFlagsUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new FeatureFlagPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ListFeatureFlagsUsecase.UseCase(repository);
    await prismaService.feature-flag.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });
});
