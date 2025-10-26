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
      const user = await UserPrismaTestingHelper.createUser(prismaService);
      const entity = new FeatureFlagEntity({
        ...FeatureFlagDataBuilder({
          name: element,
          userId: user.id,
        }),
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
      filter: {
        name: 'TEST',
      },
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
      filter: {
        name: 'TEST',
      },
    });

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });

  describe('test filters', () => {
    it('should filter by description correctly', async () => {
      const f1 = await FeatureFlagPrismaTestingHelper.createFeatureFlag(
        prismaService,
        {
          description: 'description 1',
        },
      );

      await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService, {
        description: 'description 2',
      });

      const result = await sut.execute({
        filter: {
          description: 'description 1',
        },
      });

      expect(result.total).toStrictEqual(1);
      expect(result.lastPage).toStrictEqual(1);
      expect(result.currentPage).toStrictEqual(1);
      expect(result.items).toHaveLength(1);

      const item = result.items[0];

      expect(item.description).toStrictEqual(f1.description);
    });

    it('should filter by enabled correctly', async () => {
      const f1 = await FeatureFlagPrismaTestingHelper.createFeatureFlag(
        prismaService,
        {
          enabled: true,
        },
      );

      await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService, {
        enabled: false,
      });

      const result = await sut.execute({
        filter: {
          enabled: true,
        },
      });

      expect(result.total).toStrictEqual(1);
      expect(result.lastPage).toStrictEqual(1);
      expect(result.currentPage).toStrictEqual(1);
      expect(result.items).toHaveLength(1);

      const item = result.items[0];

      expect(item.enabled).toStrictEqual(f1.enabled);
    });
  });

  it('should combine multiple filters correctly', async () => {
    const user1 = await UserPrismaTestingHelper.createUser(prismaService);
    const user2 = await UserPrismaTestingHelper.createUser(prismaService);

    const matchingFlag1 =
      await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService, {
        name: 'TEST_FLAG_1',
        description: 'Matching description',
        enabled: true,
        userId: user1.id,
      });

    const matchingFlag2 =
      await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService, {
        name: 'test_flag_2',
        description: 'Matching description',
        enabled: true,
        userId: user2.id,
      });

    await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService, {
      name: 'OTHER_FLAG',
      description: 'Different description',
      enabled: true,
    });

    await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService, {
      name: 'TEST_FLAG_3',
      description: 'Different description',
      enabled: false,
    });

    await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService, {
      name: 'OTHER_FLAG_2',
      description: 'Matching description',
      enabled: false,
    });

    const result = await sut.execute({
      filter: {
        name: 'TEST',
        description: 'Matching description',
        enabled: true,
      },
    });

    expect(result.total).toStrictEqual(2);
    expect(result.lastPage).toStrictEqual(1);
    expect(result.currentPage).toStrictEqual(1);
    expect(result.items).toHaveLength(2);

    const itemNames = result.items.map((item) => item.name).sort();
    expect(itemNames).toContainEqual(matchingFlag1.name);
    expect(itemNames).toContainEqual(matchingFlag2.name);

    result.items.forEach((item) => {
      expect(item.name.toLowerCase()).toContain('test');
      expect(item.description).toBe('Matching description');
      expect(item.enabled).toBe(true);
    });
  });
});
