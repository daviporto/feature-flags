import {
  FeatureFlagInMemoryRepository
} from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import {FeatureFlagDataBuilder} from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import {FeatureFlagEntity, FeatureFlagProps} from '@/feature-flag/domain/entities/feature-flag.entity';

function createFeatureFlagEntity(featureFlagProps: Partial<FeatureFlagProps> = {}) {
  return new FeatureFlagEntity(FeatureFlagDataBuilder(feature-flagProps));
}

describe('featureFlag in memory repository', () => {
  let sut: FeatureFlagInMemoryRepository;

  beforeEach(() => {
    sut = new FeatureFlagInMemoryRepository();
  });

  describe('apply filters method', () => {
    it('should return item with null filter', async () => {
      const items = Array.from({ length: 3 }, () => createFeatureFlagEntity());

      const spyFilter = jest.spyOn(items, 'filter');

      const result = await sut['applyFilters'](items, null);

      expect(result).toStrictEqual(items);
      expect(spyFilter).not.toHaveBeenCalled();
    });

  });

  describe('apply sort method', () => { });
});
