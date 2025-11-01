import { PrismaClient } from '@prisma/client';
import { AppUserPrismaRepository } from '@/app-user/infrastructure/database/prisma/repositories/app-user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { GetAppUserUsecase } from '@/app-user/application/usecases/get-app-user.usecase';
import { faker } from '@faker-js/faker';
import { AppUserWithIdNotFoundError } from '@/app-user/infrastructure/errors/app-user-with-id-not-found-error';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';

describe('Get app user usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: AppUserPrismaRepository;
  let sut: GetAppUserUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new AppUserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new GetAppUserUsecase.UseCase(repository);
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when app User not found', () => {
    const id = faker.string.uuid();
    expect(() => sut.execute({ id })).rejects.toThrow(
      new AppUserWithIdNotFoundError(id),
    );
  });

  it('should retrieve a app user', async () => {
    const appUser = await prismaService.appUser.create({
      data: AppUserDataBuilder({}),
    });

    const output = await sut.execute({ id: appUser.id });

    expect(output).toBeDefined();
    expect(output).toMatchObject(appUser);
  });
});
