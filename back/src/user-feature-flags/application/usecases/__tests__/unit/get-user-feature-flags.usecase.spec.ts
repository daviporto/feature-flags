import { UserFeatureFlagsInMemoryRepository } from '@/user-feature-flags/infrastructure/database/in-memory/repositories/user-feature-flags-in-memory.repository';
import { GetUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/get-user-feature-flags.usecase';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';
import { UserFeatureFlagsWithIdNotFoundError } from '@/user-feature-flags/infrastructure/errors/user-feature-flags-with-id-not-found-error';

describe('Get user-feature-flags use case test', () => {
  let sut: GetUserFeatureFlagsUsecase.UseCase;
  let repository: UserFeatureFlagsInMemoryRepository;

  beforeEach(() => {
    repository = new UserFeatureFlagsInMemoryRepository();
    sut = new GetUserFeatureFlagsUsecase.UseCase(repository);
  });

  it('should throw UserFeatureFlagsWithEmailNotFoundError if user-feature-flags does not exist', async () => {
    const input = { id: 'non-existent-id' };

    await expect(sut.execute(input)).rejects.toThrow(
      new UserFeatureFlagsWithIdNotFoundError(input.id),
    );
  });

  it('should return user-feature-flags details if user-feature-flags exists', async () => {
    const userFeatureFlags = new UserFeatureFlagsEntity(
      UserFeatureFlagsDataBuilder({}),
    );
    await repository.insert(userFeatureFlags);

    const input = { id: userFeatureFlags.id };

    const result = await sut.execute(input);

    expect(result).toStrictEqual(userFeatureFlags.toJSON());
  });

  it('should call repository findById with correct ID', async () => {
    const userFeatureFlags = new UserFeatureFlagsEntity(
      UserFeatureFlagsDataBuilder({}),
    );
    await repository.insert(userFeatureFlags);

    const spyFindById = jest.spyOn(repository, 'findById');

    const input = { id: userFeatureFlags.id };

    await sut.execute(input);

    expect(spyFindById).toHaveBeenCalledWith(userFeatureFlags.id);
  });
});
