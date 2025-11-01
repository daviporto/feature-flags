import { PrismaClient } from '@prisma/client';
import { AppUserPrismaRepository } from '@/app-user/infrastructure/database/prisma/repositories/app-user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UpdateAppUserUsecase } from '@/app-user/application/usecases/update-app-user.usecase';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { AppUserWithIdNotFoundError } from '@/app-user/infrastructure/errors/app-user-with-id-not-found-error';
import { v4 } from 'uuid';
import { AppUserPrismaTestingHelper } from '@/app-user/infrastructure/database/prisma/testing/app-user-prisma.testing-helper';

describe('Update app-user usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: AppUserPrismaRepository;
  let sut: UpdateAppUserUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new AppUserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new UpdateAppUserUsecase.UseCase(repository);

    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await resetDatabase(prismaService);

    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when app-user not found', async () => {
    const appUser = new AppUserEntity(AppUserDataBuilder());

    const input = {
      id: v4(),
      name: appUser.name,
      email: appUser.email,
      externalId: appUser.externalId,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      AppUserWithIdNotFoundError,
    );
  });

  it('should update a app-user', async () => {
    const appUser = await AppUserPrismaTestingHelper.createAppUser(
      prismaService,
      {
        name: 'Original Name',
        email: 'original@example.com',
        externalId: 'original-external-id',
      },
    );

    const input: UpdateAppUserUsecase.Input = {
      id: appUser.id,
      name: 'Updated Name',
      email: 'updated@example.com',
      externalId: 'updated-external-id',
    };

    await sut.execute(input);

    const appUserAfterUpdate = await repository.findById(appUser.id);

    expect(appUserAfterUpdate).not.toBeNull();
    expect(appUserAfterUpdate.name).toBe(input.name);
    expect(appUserAfterUpdate.email).toBe(input.email);
    expect(appUserAfterUpdate.externalId).toBe(input.externalId);
    expect(appUserAfterUpdate.updatedAt).not.toBeNull();
  });
});
