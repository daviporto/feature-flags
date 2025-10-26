import { PrismaClient } from '@prisma/client';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { FeatureFlagPrismaTestingHelper } from '@/feature-flag/infrastructure/database/prisma/testing/feature-flag-prisma.testing-helper';
import { UserPrismaTestingHelper } from '@/user/infrastructure/database/prisma/testing/user-prisma.testing-helper';

describe('List feature flags usecase integration tests', () => {
  const prismaService = new PrismaClient();
  let repository: FeatureFlagPrismaRepository;
  let sut: ListFeatureFlagsUsecase.UseCase;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new FeatureFlagPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ListFeatureFlagsUsecase.UseCase(repository);

    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await resetDatabase(prismaService);

    await prismaService.$disconnect();
    await module.close();
  });

  it('should retrieve feature flags orderedBy createdAt as default', async () => {
    const entities = [];
    for (let i = 0; i < 11; i++) {
      const user = await UserPrismaTestingHelper.createUser(prismaService);

      const entity =
        await FeatureFlagPrismaTestingHelper.createFeatureFlagAsEntity(
          prismaService,
          {
            name: ' ' + i,
            userId: user.id,
          },
        );
      entities.push(entity);
    }

    const output = await sut.execute({});

    expect(output).not.toBeNull();
    expect(output.items).toHaveLength(10);
    expect(output.total).toBe(11);
    expect(output.currentPage).toBe(1);
    expect(output.lastPage).toBe(2);
  });

  it('should returns output using filter, sort and paginate', async () => {
    const createdAt = new Date();
    const entities: FeatureFlagEntity[] = [];
    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
    for (const element of arrange) {
      const index = arrange.indexOf(element);
      const entity = new FeatureFlagEntity({
        ...FeatureFlagDataBuilder({ name: element }),
        createdAt: new Date(createdAt.getTime() + index),
      });

      entities.push(entity);
      await prismaService.featureFlag.create({ data: entity.toJSON() });
    }

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });
});
