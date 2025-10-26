import { PrismaClient } from '@prisma/client';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { v4 } from 'uuid';
import { UserPrismaRepository } from '@/user/infrastructure/database/prisma/repositories/user-prisma.repository';
import { CreateFeatureFlagUsecase } from '@/feature-flag/application/usecases/create-feature-flag.usecase';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { UserPrismaTestingHelper } from '@/user/infrastructure/database/prisma/testing/user-prisma.testing-helper';

describe('Update featureFlag usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: FeatureFlagPrismaRepository;
  let userRepository: UserPrismaRepository;
  let sut: CreateFeatureFlagUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new FeatureFlagPrismaRepository(prismaService as any);
    userRepository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new CreateFeatureFlagUsecase.UseCase(repository, userRepository);

    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await resetDatabase(prismaService);

    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when user not found', async () => {
    const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

    const input = {
      userId: v4(),
      name: ff.name,
      description: ff.description,
      enabled: ff.enabled,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      UserWithIdNotFoundError,
    );
  });

  it('should create a featureFlag', async () => {
    const user = await UserPrismaTestingHelper.createUser(prismaService);

    const input: CreateFeatureFlagUsecase.Input = {
      userId: user.id,
      enabled: true,
      name: 'name',
      description: 'description',
    };

    const createdFlag = await sut.execute(input);

    expect(createdFlag).not.toBeNull();

    const featureFlagFromDb = await repository.findById(createdFlag.id);

    expect(featureFlagFromDb).not.toBeNull();
    expect(featureFlagFromDb.name).toBe(input.name);
    expect(featureFlagFromDb.description).toBe(input.description);
    expect(featureFlagFromDb.enabled).toBe(input.enabled);
    expect(featureFlagFromDb.updatedAt).not.toBeNull();
  });
});
