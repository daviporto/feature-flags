import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { GetFeatureFlagUsecase } from '@/feature-flag/application/usecases/get-feature-flag.usecase';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';

describe('Get featureflag use case test', () => {
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

  it('should return featureflag details if featureflag exists', async () => {
    const feature-flag = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    await repository.insert(feature-flag);

    const input = { id: feature-flag.id };

    const result = await sut.execute(input);

    expect(result).toStrictEqual(feature-flag.toJSON());
  });

  it('should call repository findById with correct ID', async () => {
    const feature_flag = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    await repository.insert(feature-flag);

    const spyFindById = jest.spyOn(repository, 'findById');

    const input = { id: feature_flag.id };

    await sut.execute(input);

    expect(spyFindById).toHaveBeenCalledWith(feature_flag.id);
  });
});
