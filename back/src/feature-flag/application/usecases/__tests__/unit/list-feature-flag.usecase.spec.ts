import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';
import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { FeatureFlagEntity, FeatureFlagProps } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';

describe('List featureflags use cases unit tests', () => {
  function createFeatureFlagEntity(feature-flagProps: Partial<FeatureFlagProps> = {}) {
    return new FeatureFlagEntity(FeatureFlagDataBuilder(feature-flagProps));
  }

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

    it('should return featureflag entity result in output', () => {
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

  it('should return sorted by created at by default', async () => {
    const initialDate = new Date();
    const feature-flags = [
      createFeatureFlagEntity({ createdAt: initialDate }),
      createFeatureFlagEntity({ createdAt: new Date(initialDate.getTime() + 1) }),
      createFeatureFlagEntity({ createdAt: new Date(initialDate.getTime() + 2) }),
    ];
    repository.items = feature-flags;

    const result = await sut.execute({});

    expect(result.total).toBe(feature-flags.length);
    expect(result.currentPage).toBe(1);
    expect(result.lastPage).toBe(1);
    expect(result.perPage).toBe(10);

    expect(result.items[0].createdAt.getTime()).toStrictEqual(
      initialDate.getTime() + 2,
    );

    expect(result.items[1].createdAt.getTime()).toStrictEqual(
      initialDate.getTime() + 1,
    );
    expect(result.items[2].createdAt.getTime()).toStrictEqual(
      initialDate.getTime(),
    );
  });

  it('should return feature-flags filtered, paginated and sorted', async () => {
    const feature-flags = [
      createFeatureFlagEntity({ name: 'a' }),
      createFeatureFlagEntity({ name: 'A' }),
      createFeatureFlagEntity({ name: 'b' }),
      createFeatureFlagEntity({ name: 'c' }),
    ];
    repository.items = feature-flags;

    const result = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: SortOrderEnum.ASC,
      filter: 'a',
    });

    expect(result.total).toBe(2);
    expect(result.currentPage).toBe(1);
    expect(result.lastPage).toBe(1);
    expect(result.perPage).toBe(2);

    expect(result.items[0].name).toBe('A');
    expect(result.items[1].name).toBe('a');
  });

  it.todo('should return second page when empty in pagination', async () => {
  });

  it.todo('should return items in second page when having them', async () => {
  });

  it.todo('should return empty result when no filter found', async () => {
  });
});
