import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { v4 } from 'uuid';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';
import { CreateFeatureFlagUsecase } from '@/feature-flag/application/usecases/create-feature-flag.usecase';
import { UserInMemoryRepository } from '@/user/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';

describe('Create feature flag use case test', () => {
  let sut: CreateFeatureFlagUsecase.UseCase;
  let repository: FeatureFlagInMemoryRepository;
  let userRepository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new FeatureFlagInMemoryRepository();
    userRepository = new UserInMemoryRepository();

    sut = new CreateFeatureFlagUsecase.UseCase(repository, userRepository);
  });

  it('should throw invalidUUid if feature user id not valid uuid', async () => {
    const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

    const input: CreateFeatureFlagUsecase.Input = {
      name: ff.name,
      description: ff.description,
      enabled: ff.enabled,
      userId: 'not a valid uuid',
    };

    await expect(() => sut.execute(input)).rejects.toThrow(InvalidUuidError);
  });

  it('should throw userWithIdNotFoundError if user does not exist', async () => {
    const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

    const input = {
      userId: v4(),
      name: ff.name,
      description: ff.description,
      enabled: ff.enabled,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      UserWithIdNotFoundError,
    );
  });

  describe('missing parameters', () => {
    it('should throw error when missing userId', async () => {
      const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

      const input = {
        name: ff.name,
        description: ff.description,
        enabled: ff.enabled,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });
    it('should throw error when missing name', async () => {
      const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

      const input = {
        userId: 'random',
        description: ff.description,
        enabled: ff.enabled,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing description', async () => {
      const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

      const input = {
        userId: 'random',
        name: ff.name,
        enabled: ff.enabled,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing enabled', async () => {
      const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

      const input = {
        userId: 'random',
        name: ff.name,
        description: ff.description,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });
  });
});
