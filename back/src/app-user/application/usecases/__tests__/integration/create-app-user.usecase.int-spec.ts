import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { AppUserPrismaRepository } from '@/app-user/infrastructure/database/prisma/repositories/app-user-prisma.repository';
import { CreateAppUserUsecase } from '@/app-user/application/usecases/create-app-user.usecase';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { v4 } from 'uuid';
import { AppUserWithIdNotFoundError } from '@/app-user/infrastructure/errors/app-user-with-id-not-found-error';
import { AppUserPrismaTestingHelper } from '@/app-user/infrastructure/database/prisma/testing/app-user-prisma.testing-helper';

describe('Create App User usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: AppUserPrismaRepository;
  let sut: CreateAppUserUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new AppUserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new CreateAppUserUsecase.UseCase(repository);

    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await resetDatabase(prismaService);

    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when app user not found', async () => {
    const ff = new AppUserEntity(AppUserDataBuilder());

    const input = {
      externalId: v4(),
      name: ff.name,
      email: ff.email,
    };

    await expect(sut.execute(input)).rejects.toThrow(
      AppUserWithIdNotFoundError,
    );
  });

  it('should create a app user', async () => {
    const user = await AppUserPrismaTestingHelper.createAppUser(prismaService);

    const input: CreateAppUserUsecase.Input = {
      externalId: user.id,
      email: 'alan.turing@email.com',
      name: 'Alan Turing',
    };

    const createAppUser = await sut.execute(input);

    expect(createAppUser).not.toBeNull();

    const appUserFromDb = await repository.findById(createAppUser.id);

    expect(appUserFromDb).not.toBeNull();
    expect(appUserFromDb.name).toBe(input.name);
    expect(appUserFromDb.email).toBe(input.email);
    expect(appUserFromDb.externalId).toBe(input.externalId);
    expect(appUserFromDb.createdAt).not.toBeNull();
  });
});
