import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { GetFeatureFlagUsecase } from '@/feature-flag/application/usecases/get-feature-flag.usecase';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';

describe('Get feature flag use case test', () => {
  let sut: GetFeatureFlagUsecase.UseCase;
  let repository: FeatureFlagInMemoryRepository;

  beforeEach(() => {
    repository = new FeatureFlagInMemoryRepository();
    sut = new GetFeatureFlagUsecase.UseCase(repository);
  });

  it('should throw FeatureFlagWithEmailNotFoundError if feature-flag does not exist', async () => {
    const input = { id: 'non-existent-id' };

    await expect(sut.execute(input)).rejects.toThrow(
      new FeatureFlagWithIdNotFoundError(input.id),
    );
  });

  it('should return feature flag details if feature flag exists', async () => {
    const featureFlag = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    await repository.insert(featureFlag);

    const input = { id: featureFlag.id };

    const result = await sut.execute(input);

    expect(result).toStrictEqual(featureFlag.toJSON());
  });

  it('should call repository findById with correct ID', async () => {
    const featureFlag = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    await repository.insert(featureFlag);

    const spyFindById = jest.spyOn(repository, 'findById');

    const input = { id: featureFlag.id };

    await sut.execute(input);

    expect(spyFindById).toHaveBeenCalledWith(featureFlag.id);
  });
});
