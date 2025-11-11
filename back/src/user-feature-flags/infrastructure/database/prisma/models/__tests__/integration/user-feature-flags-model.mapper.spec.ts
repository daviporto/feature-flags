import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { PrismaClient, UserFeatureFlag } from '@prisma/client';
import { UserFeatureFlagsModelMapper } from '@/user-feature-flags/infrastructure/database/prisma/models/user-feature-flags-model.mapper';
import { ValidationErrors } from '@/shared/domain/errors/validation-errors';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';

describe('UserFeatureFlags model mapper integration tests', () => {
  let prismaService: PrismaService;
  let props: any;

  beforeAll(async () => {
    setUpPrismaTest();

    prismaService = new PrismaService();
    props = UserFeatureFlagsDataBuilder({});
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await resetDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throw error when user-feature-flag model is invalid', () => {
    const model: UserFeatureFlag = Object.assign({}, props, {
      featureFlagId: null,
      id: 'test-id',
    });

    expect(() => UserFeatureFlagsModelMapper.toEntity(model)).toThrow(
      ValidationErrors,
    );
  });

  it('should map user-feature-flag model to entity', async () => {
    // Create a feature flag and app user first
    const featureFlag = await prismaService.featureFlag.create({
      data: {
        name: 'test-flag',
        description: 'test',
        enabled: true,
        userId: (await prismaService.user.create({
          data: {
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashed',
          },
        })).id,
      },
    });

    const appUser = await prismaService.appUser.create({
      data: {
        name: 'Test App User',
        email: 'appuser@example.com',
        externalId: 'ext-123',
      },
    });

    const model = await prismaService.userFeatureFlag.create({
      data: {
        featureFlagId: featureFlag.id,
        userId: appUser.id,
        enabled: true,
      },
    });

    const sut = UserFeatureFlagsModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(UserFeatureFlagsEntity);
    expect(sut.featureFlagId).toBe(featureFlag.id);
    expect(sut.userId).toBe(appUser.id);
    expect(sut.enabled).toBe(true);
  });
});
