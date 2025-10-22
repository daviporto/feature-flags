import {
  FeatureFlagInMemoryRepository
} from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import {FeatureFlagEntity} from '@/feature-flag/domain/entities/feature-flag.entity';
import {DeleteFeatureFlagUsecase} from '@/feature-flag/application/usecases/delete-feature-flag.usecase';

describe('Delete feature flag use case test', () => {
    let sut: DeleteFeatureFlagUsecase.UseCase;
    let repository: FeatureFlagInMemoryRepository;

    beforeEach(() => {
        repository = new FeatureFlagInMemoryRepository();
        sut = new DeleteFeatureFlagUsecase.UseCase(repository);
    });

    it('should throw exception if feature flag does not exist', async () => {
        const input = {id: 'non-existent-id'};

        await expect(sut.execute(input)).rejects.toThrow(
        );
    });


    it('should call repository delete with correct ID', async () => {
        const feature_flag = new FeatureFlagEntity();
        await repository.insert(feature_flag);

        const spyDelete = jest.spyOn(repository, 'delete');

        const input = {id: feature_flag.id};

        expect(repository.items).toHaveLength(1)
        await sut.execute(input);

        expect(spyDelete).toHaveBeenCalledWith(feature_flag.id);

        expect(repository.items).toHaveLength(0)
    });
});
