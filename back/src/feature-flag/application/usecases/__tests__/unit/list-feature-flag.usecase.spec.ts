import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';
import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';

describe('List feature flags use cases unit tests', () => {
  let sut: ListFeatureFlagsUsecase.UseCase;
  let repository: FeatureFlagInMemoryRepository;

  beforeEach(() => {
    repository = new FeatureFlagInMemoryRepository();
    sut = new ListFeatureFlagsUsecase.UseCase(repository);
  });

  describe('test to output', () => {
    it('should return empty result in output', () => {
      const result = new FeatureFlagRepository.SearchResult({
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

    it('should return feature flag entity result in output', () => {
      const entity = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
      const result = new FeatureFlagRepository.SearchResult({
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
