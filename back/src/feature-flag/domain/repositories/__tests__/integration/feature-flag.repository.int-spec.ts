import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { PrismaClient } from '@prisma/client';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { faker } from '@faker-js/faker';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';

describe('FeatureFlag prisma repository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: FeatureFlagPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setUpPrismaTest();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new FeatureFlagPrismaRepository(prismaService as any);
    await prismaService.feature-flag.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
  });

  it('should throw error when entity does not exist', () => {
    expect(() => sut.findById('1')).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError('1'),
    );
  });

  it('should find feature-flag by id', async () => {
    const entity = new FeatureFlagEntity(FeatureFlagDataBuilder({}));

    const createdFeatureFlag = await prismaService.feature-flag.create({
      data: entity.toJSON(),
    });

    const feature-flag = await sut.findById(createdFeatureFlag.id);

    expect(sut).not.toBeNull();
    expect(feature-flag.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should insert a new feature-flag', async () => {
    const entity = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    await sut.insert(entity);

  });

  it('should return one feature-flag if theres only one with find all', async () => {
    const entity = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    await sut.insert(entity);

    const feature-flags = await sut.findAll();

    expect(feature-flags).toHaveLength(1);
    expect(feature-flags[0].toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throw error when trying to update non-existent featureflag', async () => {
    const nonExistentId = faker.string.uuid();
    const entity = new FeatureFlagEntity(FeatureFlagDataBuilder({}), nonExistentId);

    await expect(sut.update(entity)).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError(nonExistentId),
    );
  });

  it('should update a featureflag successfully', async () => { });

  it('should throw error when trying to delete non-existent featureflag', async () => {
    const nonExistentId = faker.string.uuid();

    await expect(sut.delete(nonExistentId)).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError(nonExistentId),
    );
  });

  it('should delete a featureflag successfully', async () => {
    const entity = new FeatureFlagEntity(FeatureFlagDataBuilder({ name: 'John' }));
    await sut.insert(entity);

    await sut.delete(entity.id);

    const feature-flagCount = await prismaService.feature-flag.count({
      where: { id: entity.id },
    });

    expect(feature-flagCount).toBe(0);
  });


  describe('search tests', () => {
    it.todo('should return with default values', async () => { });

    it.todo('should paginate feature-flags', async () => { });
  });
});
