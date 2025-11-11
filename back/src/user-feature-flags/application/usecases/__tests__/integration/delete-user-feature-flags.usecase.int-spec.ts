import { PrismaClient } from '@prisma/client';
import { UserFeatureFlagsPrismaRepository } from '@/user-feature-flags/infrastructure/database/prisma/repositories/user-feature-flags-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
resetDatabase,
setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { DeleteUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/delete-user-feature-flags.usecase';

describe('Delete UserFeatureFlags usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserFeatureFlagsPrismaRepository;
  let sut: DeleteUserFeatureFlagsUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserFeatureFlagsPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteUserFeatureFlagsUsecase.UseCase(repository);
    await resetDatabase(prismaService);
    });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when user-feature-flags not found', () => { });

  it('should delete a user-feature-flags', async () => {
  });
});
