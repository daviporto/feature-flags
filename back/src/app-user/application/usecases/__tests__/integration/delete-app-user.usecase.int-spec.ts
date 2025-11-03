import { PrismaClient } from '@prisma/client';
import { AppUserPrismaRepository } from '@/app-user/infrastructure/database/prisma/repositories/app-user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { DeleteAppUserUsecase } from '@/app-user/application/usecases/delete-app-user.usecase';
import { faker } from '@faker-js/faker';
import { AppUserWithIdNotFoundError } from '@/app-user/infrastructure/errors/app-user-with-id-not-found-error';
import { AppUserPrismaTestingHelper } from '@/app-user/infrastructure/database/prisma/testing/app-user-prisma.testing-helper';

describe('Delete AppUser usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: AppUserPrismaRepository;
  let sut: DeleteAppUserUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new AppUserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteAppUserUsecase.UseCase(repository);
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when appuser not found', () => {
    const id = faker.string.uuid();
    expect(() => sut.execute({ id })).rejects.toThrow(
      new AppUserWithIdNotFoundError(id),
    );
  });

  it('should delete a appuser', async () => {
    const appUser = await AppUserPrismaTestingHelper.createAppUser(prismaService);

    await sut.execute({ id: appUser.id });

    const appUserCount = await prismaService.appUser.count({
      where: { id: appUser.id },
    });

    expect(appUserCount).toBe(0);
  });
});
