import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { ClientFeatureFlagUsecase } from '../../client-feature-flag.usecase';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';

describe('CLient Feature Flag use case test', () => {
  let sut: ClientFeatureFlagUsecase.UseCase;
  let repository: FeatureFlagInMemoryRepository;

  beforeEach(() => {
    repository = new FeatureFlagInMemoryRepository();

    sut = new ClientFeatureFlagUsecase.UseCase(repository);
  });

  it('should throw FeatureFlagWithIdNotFoundError error if feature flag id is invalid', async () => {
    const input: ClientFeatureFlagUsecase.Input = {
      featureFlagId: 'invalid uuid',
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError(input.featureFlagId),
    );
  });

  it('should call repository findById with correct ID', async () => {
    const featureFlag = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    await repository.insert(featureFlag);

    const spyFindById = jest.spyOn(repository, 'findById');

    const input: ClientFeatureFlagUsecase.Input = {
      featureFlagId: featureFlag.id,
    };

    await sut.execute(input);

    expect(spyFindById).toHaveBeenCalledWith(featureFlag.id);
  });
});
