import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { FeatureFlagWithEmailNotFoundError } from '@/feature-flag/domain/errors/feature-flag-with-email-not-found-error';
import { faker } from '@faker-js/faker';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { FeatureFlagEntity, FeatureFlagProps } from '@/feature-flag/domain/entities/feature-flag.entity';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';

function createFeatureFlagEntity(feature-flagProps: Partial<FeatureFlagProps> = {}) {
  return new FeatureFlagEntity(FeatureFlagDataBuilder(feature-flagProps));
}

describe('feature-flag in memory repository', () => {
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
