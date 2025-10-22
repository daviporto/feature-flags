import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { FeatureFlag } from '@prisma/client';
import { FeatureFlagModelMapper } from '@/feature-flag/infrastructure/database/prisma/models/feature-flag-model.mapper';
import { ValidationErrors } from '@/shared/domain/errors/validation-errors';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';

describe('FeatureFlag model mapper integration tests', () => {
  let prismaService: PrismaService;
  let props: any;

  beforeAll(async () => {
    setUpPrismaTest();
    
    prismaService = new PrismaService();
    props = FeatureFlagDataBuilder({});
    await prismaService.$connect();
  });

  beforeEach(() => {
    prismaService.featureFlag.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throw error when feature-flag model is invalid', () => {
    const model: FeatureFlag = Object.assign({}, props, { name: null });

    expect(() => FeatureFlagModelMapper.toEntity(model)).toThrow(
      new ValidationErrors('Could not load feature flag having id undefined'),
    );
  });

  it('should map feature flag model to entity', async () => {
    const model: FeatureFlag = await prismaService.featureFlag.create({
      data: props,
    });

    const sut = FeatureFlagModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(FeatureFlagEntity);
  });
});
