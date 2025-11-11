import { UserFeatureFlagsInMemoryRepository } from '@/user-feature-flags/infrastructure/database/in-memory/repositories/user-feature-flags-in-memory.repository';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';
import { UserFeatureFlagsWithIdNotFoundError } from '@/user-feature-flags/infrastructure/errors/user-feature-flags-with-id-not-found-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UpdateUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/update-user-feature-flags.usecase';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';
import { v4 } from 'uuid';

describe('Update user-feature-flags use case test', () => {
  let sut: UpdateUserFeatureFlagsUsecase.UseCase;
  let repository: UserFeatureFlagsInMemoryRepository;

  beforeEach(() => {
    repository = new UserFeatureFlagsInMemoryRepository();
    sut = new UpdateUserFeatureFlagsUsecase.UseCase(repository);
  });

  it('should throw invalidUuid if user feature flag id is not valid', async () => {
    const userFeatureFlag = new UserFeatureFlagsEntity(
      UserFeatureFlagsDataBuilder(),
    );

    const input = {
      id: 'random',
      featureFlagId: userFeatureFlag.featureFlagId,
      userId: userFeatureFlag.userId,
      enabled: userFeatureFlag.enabled,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(InvalidUuidError);
  });

  it('should throw UserFeatureFlagsWithIdNotFoundError if user feature flag does not exist', async () => {
    const userFeatureFlag = new UserFeatureFlagsEntity(
      UserFeatureFlagsDataBuilder(),
    );

    const input = {
      id: v4(),
      featureFlagId: userFeatureFlag.featureFlagId,
      userId: userFeatureFlag.userId,
      enabled: userFeatureFlag.enabled,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      UserFeatureFlagsWithIdNotFoundError,
    );
  });

  describe('missing parameters', () => {
    it('should throw error when missing id', async () => {
      const userFeatureFlag = new UserFeatureFlagsEntity(
        UserFeatureFlagsDataBuilder(),
      );

      const input = {
        featureFlagId: userFeatureFlag.featureFlagId,
        userId: userFeatureFlag.userId,
        enabled: userFeatureFlag.enabled,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing userId', async () => {
      const userFeatureFlag = new UserFeatureFlagsEntity(
        UserFeatureFlagsDataBuilder(),
      );

      const input = {
        id: userFeatureFlag.id,
        featureFlagId: userFeatureFlag.featureFlagId,
        enabled: userFeatureFlag.enabled,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing featureFlagId', async () => {
      const userFeatureFlag = new UserFeatureFlagsEntity(
        UserFeatureFlagsDataBuilder(),
      );

      const input = {
        id: userFeatureFlag.id,
        userId: userFeatureFlag.userId,
        enabled: userFeatureFlag.enabled,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing enabled', async () => {
      const userFeatureFlag = new UserFeatureFlagsEntity(
        UserFeatureFlagsDataBuilder(),
      );

      const input = {
        id: 'random',
        featureFlagId: userFeatureFlag.featureFlagId,
        userId: userFeatureFlag.userId,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });
  });

  it('should update an appuser', async () => {
    const userFeatureFlag = new UserFeatureFlagsEntity(
      UserFeatureFlagsDataBuilder(),
    );
    const originalEnabled = userFeatureFlag.enabled;
    repository.items = [userFeatureFlag];

    const input = {
      id: userFeatureFlag.id,
      userId: userFeatureFlag.userId,
      featureFlagId: userFeatureFlag.featureFlagId,
      enabled: !originalEnabled,
    };

    const output = await sut.execute(input);

    expect(output).toBeDefined();
    expect(output.id).toBe(userFeatureFlag.id);
    expect(output.userId).toBe(userFeatureFlag.userId);
    expect(output.featureFlagId).toBe(userFeatureFlag.featureFlagId);
    expect(output.enabled).toBe(!originalEnabled);
  });
});
