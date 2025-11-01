import { PrismaClient } from '@prisma/client';
import { AppUserPrismaRepository } from '@/app-user/infrastructure/database/prisma/repositories/app-user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { ListAppUsersUsecase } from '@/app-user/application/usecases/list-app-user.usecase';
import { AppUserPrismaTestingHelper } from '@/app-user/infrastructure/database/prisma/testing/app-user-prisma.testing-helper';

describe('List app users usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: AppUserPrismaRepository;
  let sut: ListAppUsersUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new AppUserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ListAppUsersUsecase.UseCase(repository);
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should return a list of app users', async () => {
    await AppUserPrismaTestingHelper.createAppUser(prismaService, {
      name: 'User 1',
    });
    await AppUserPrismaTestingHelper.createAppUser(prismaService, {
      name: 'User 2',
    });
    await AppUserPrismaTestingHelper.createAppUser(prismaService, {
      name: 'User 3',
    });

    const output = await sut.execute({});

    expect(output).toBeDefined();
    expect(output.items).toHaveLength(3);
    expect(output.total).toBe(3);
    expect(output.currentPage).toBe(1);
    expect(output.perPage).toBe(10);
  });

  it('should paginate app users', async () => {
    for (let i = 1; i <= 7; i++) {
      await AppUserPrismaTestingHelper.createAppUser(prismaService, {
        name: `User ${i}`,
      });
    }

    const output = await sut.execute({
      page: 2,
      perPage: 3,
    });

    expect(output).toBeDefined();
    expect(output.items).toHaveLength(3);
    expect(output.total).toBe(7);
    expect(output.currentPage).toBe(2);
    expect(output.perPage).toBe(3);
  });

  it('should filter app users by name', async () => {
    await AppUserPrismaTestingHelper.createAppUser(prismaService, {
      name: 'John Doe',
    });
    await AppUserPrismaTestingHelper.createAppUser(prismaService, {
      name: 'Jane Smith',
    });
    await AppUserPrismaTestingHelper.createAppUser(prismaService, {
      name: 'John Smith',
    });

    const output = await sut.execute({
      filter: { name: 'John' },
    });

    expect(output).toBeDefined();
    expect(output.items).toHaveLength(2);
    expect(output.total).toBe(2);
    expect(output.items.every((item) => item.name.includes('John'))).toBe(true);
  });
});
