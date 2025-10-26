import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { DeleteFeatureFlagUsecase } from '@/feature-flag/application/usecases/delete-feature-flag.usecase';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';

describe('Delete feature flag use case test', () => {
  let sut: DeleteFeatureFlagUsecase.UseCase;
  let repository: FeatureFlagInMemoryRepository;

  beforeEach(() => {
    repository = new FeatureFlagInMemoryRepository();
    sut = new DeleteFeatureFlagUsecase.UseCase(repository);
  });

  it('should throw exception if feature flag does not exist', async () => {
    const input = { id: 'non-existent-id' };

    await expect(sut.execute(input)).rejects.toThrow();
  });

  it('should call repository delete with correct ID', async () => {
    const featureFlagEntity = new FeatureFlagEntity(FeatureFlagDataBuilder());
    await repository.insert(featureFlagEntity);

    const spyDelete = jest.spyOn(repository, 'delete');

    const input = { id: featureFlagEntity.id };

    expect(repository.items).toHaveLength(1);
    await sut.execute(input);

    expect(spyDelete).toHaveBeenCalledWith(featureFlagEntity.id);

    expect(repository.items).toHaveLength(0);
  });
});
