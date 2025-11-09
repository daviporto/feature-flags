import { PrismaClient } from '@prisma/client';
import { UserFeatureFlagsPrismaRepository } from '@/user-feature-flags/infrastructure/database/prisma/repositories/user-feature-flags-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
resetDatabase,
setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';
import { UserFeatureFlagsWithIdNotFoundError } from '@/user-feature-flags/infrastructure/errors/user-feature-flags-with-id-not-found-error';
import { UpdateUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/update-user-feature-flags.usecase';

describe('Update user-feature-flags usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: UserFeatureFlagsPrismaRepository;
  let sut: UpdateUserFeatureFlagsUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new UserFeatureFlagsPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new UpdateUserFeatureFlagsUsecase.UseCase(repository);
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it.todo('should throw error when user-feature-flags not found');

  it.todo('should update a user-feature-flags');
});
