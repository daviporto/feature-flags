import { PrismaClient } from '@prisma/client';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UpdateFeatureFlagUsecase } from '@/feature-flag/application/usecases/update-feature-flag.usecase';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';
import { v4 } from 'uuid';
import { FeatureFlagPrismaTestingHelper } from '@/feature-flag/infrastructure/database/prisma/testing/feature-flag-prisma.testing-helper';

describe('Update featureFlag usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: FeatureFlagPrismaRepository;
  let sut: UpdateFeatureFlagUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new FeatureFlagPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new UpdateFeatureFlagUsecase.UseCase(repository);

    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await resetDatabase(prismaService);

    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when featureFlag not found', async () => {
    const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

    const input = {
      id: v4(),
      name: ff.name,
      description: ff.description,
      enabled: ff.enabled,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      FeatureFlagWithIdNotFoundError,
    );
  });

  it('should update a featureFlag', async () => {
    const ff = await FeatureFlagPrismaTestingHelper.createFeatureFlag(
      prismaService,
      {
        enabled: false,
      },
    );

    const input: UpdateFeatureFlagUsecase.Input = {
      id: ff.id,
      enabled: true,
      name: 'updated name',
      description: 'updated description',
    };

    await sut.execute(input);

    const ffAfterUpdate = await repository.findById(ff.id);

    expect(ffAfterUpdate).not.toBeNull();
    expect(ffAfterUpdate.name).toBe(input.name);
    expect(ffAfterUpdate.description).toBe(input.description);
    expect(ffAfterUpdate.enabled).toBe(input.enabled);
    expect(ffAfterUpdate.updatedAt).not.toBeNull();
  });
});
