import { UserFeatureFlagsInMemoryRepository } from '@/user-feature-flags/infrastructure/database/in-memory/repositories/user-feature-flags-in-memory.repository';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { DeleteUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/delete-user-feature-flags.usecase';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';

describe('Delete user-feature-flags use case test', () => {
  let sut: DeleteUserFeatureFlagsUsecase.UseCase;
  let repository: UserFeatureFlagsInMemoryRepository;

  beforeEach(() => {
    repository = new UserFeatureFlagsInMemoryRepository();
    sut = new DeleteUserFeatureFlagsUsecase.UseCase(repository);
  });

  it('should throw exception if user-feature-flags does not exist', async () => {
    const input = { id: 'non-existent-id' };

    await expect(sut.execute(input)).rejects.toThrow();
  });

  it('should call repository delete with correct ID', async () => {
    const userFeatureFlagEntity = new UserFeatureFlagsEntity(
      UserFeatureFlagsDataBuilder(),
    );
    await repository.insert(userFeatureFlagEntity);

    const spyDelete = jest.spyOn(repository, 'delete');

    const input = { id: userFeatureFlagEntity.id };

    expect(repository.items).toHaveLength(1);
    await sut.execute(input);

    expect(spyDelete).toHaveBeenCalledWith(userFeatureFlagEntity.id);

    expect(repository.items).toHaveLength(0);
  });
});
