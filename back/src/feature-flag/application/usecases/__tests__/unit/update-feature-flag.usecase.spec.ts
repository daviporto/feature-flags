import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UpdateFeatureFlagUsecase } from '@/feature-flag/application/usecases/update-feature-flag.usecase';
import { v4 } from 'uuid';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';

describe('Update feature flag use case test', () => {
  let sut: UpdateFeatureFlagUsecase.UseCase;
  let repository: FeatureFlagInMemoryRepository;

  beforeEach(() => {
    repository = new FeatureFlagInMemoryRepository();
    sut = new UpdateFeatureFlagUsecase.UseCase(repository);
  });

  it('should throw invalidUUid if feature flag does not exist', async () => {
    const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

    const input = {
      id: 'random',
      name: ff.name,
      description: ff.description,
      enabled: ff.enabled,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(InvalidUuidError);
  });

  it('should throw feature flag WithIdNotFoundError if feature flag does not exist', async () => {
    const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

    const input = {
      id: v4(),
      name: ff.name,
      description: ff.description,
      enabled: ff.enabled,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      FeatureFlagWithIdNotFoundError,
    );
  });

  describe('missing parameters', () => {
    it('should throw error when missing id', async () => {
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
        id: 'random',
        description: ff.description,
        enabled: ff.enabled,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing description', async () => {
      const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

      const input = {
        id: 'random',
        name: ff.name,
        enabled: ff.enabled,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing enabled', async () => {
      const ff = new FeatureFlagEntity(FeatureFlagDataBuilder());

      const input = {
        id: 'random',
        name: ff.name,
        description: ff.description,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });
  });
});
