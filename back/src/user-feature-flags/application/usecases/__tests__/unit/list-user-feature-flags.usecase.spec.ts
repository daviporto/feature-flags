import { ListUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/list-user-feature-flags.usecase';
import { UserFeatureFlagsInMemoryRepository } from '@/user-feature-flags/infrastructure/database/in-memory/repositories/user-feature-flags-in-memory.repository';
import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';

describe('List user-feature-flagss use cases unit tests', () => {
  let sut: ListUserFeatureFlagsUsecase.UseCase;
  let repository: UserFeatureFlagsInMemoryRepository;

  beforeEach(() => {
    repository = new UserFeatureFlagsInMemoryRepository();
    sut = new ListUserFeatureFlagsUsecase.UseCase(repository);
  });

  describe('test to output', () => {
    it('should return empty result in output', () => {
      const result = new UserFeatureFlagsRepository.SearchResult({
        items: [],
        total: 1,
        currentPage: 1,
        perPage: 1,
        sort: null,
        sortDir: null,
        filter: null,
      });

      const output = sut['toOutput'](result);

      expect(output).toStrictEqual({
        items: [],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 1,
      });
    });

    it('should return user-feature-flags entity result in output', () => {
      const entity = new UserFeatureFlagsEntity(
        UserFeatureFlagsDataBuilder({}),
      );
      const result = new UserFeatureFlagsRepository.SearchResult({
        items: [entity],
        total: 1,
        currentPage: 1,
        perPage: 1,
        sort: null,
        sortDir: null,
        filter: null,
      });

      const output = sut['toOutput'](result);

      expect(output).toStrictEqual({
        items: [entity.toJSON()],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 1,
      });
    });
  });
});
