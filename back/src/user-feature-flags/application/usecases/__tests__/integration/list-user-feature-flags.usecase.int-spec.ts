import { PrismaClient } from '@prisma/client';
import { UserFeatureFlagsPrismaRepository } from '@/user-feature-flags/infrastructure/database/prisma/repositories/user-feature-flags-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { ListUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/list-user-feature-flags.usecase';
import { UserFeatureFlagPrismaTestingHelper } from '@/user-feature-flags/infrastructure/database/prisma/testing/user-feature-flag-prisma.testing-helper';

describe('List user-feature-flags usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserFeatureFlagsPrismaRepository;
  let sut: ListUserFeatureFlagsUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserFeatureFlagsPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ListUserFeatureFlagsUsecase.UseCase(repository);
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should list user-feature-flags', async () => {
    await UserFeatureFlagPrismaTestingHelper.createUserFeatureFlagAsEntity(
      prismaService,
    );
    await UserFeatureFlagPrismaTestingHelper.createUserFeatureFlagAsEntity(
      prismaService,
    );

    const output = await sut.execute({});

    expect(output).toBeDefined();
    expect(output.items).toHaveLength(2);
    expect(output.total).toBe(2);
  });

  it('should return empty list when no user-feature-flags exist', async () => {
    const output = await sut.execute({});

    expect(output).toBeDefined();
    expect(output.items).toHaveLength(0);
    expect(output.total).toBe(0);
  });
});
