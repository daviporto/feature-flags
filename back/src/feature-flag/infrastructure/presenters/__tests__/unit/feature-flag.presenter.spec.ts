import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import {
  FeatureFlagCollectionPresenter,
  FeatureFlagPresenter,
} from '@/feature-flag/infrastructure/presenters/feature-flag.presenter';
import { faker } from '@faker-js/faker';
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';

describe('FeatureFlag presenter unit tests', () => {
  const id = faker.string.uuid();
  let props = { ...FeatureFlagDataBuilder({}), id };
  let sut: FeatureFlagPresenter;

  beforeEach(() => {
    sut = new FeatureFlagPresenter(props);
  });

  it.todo('Constructor', () => { });

  it('Should present the date as expected', () => {
    const output = instanceToPlain(sut);
  });

  describe('FeatureFlagCollectionPresenter', () => {
    let sut: FeatureFlagCollectionPresenter;

    it('Constructor', () => {
      const sut = new FeatureFlagCollectionPresenter({
        items: [props],
        currentPage: 2,
        lastPage: 3,
        perPage: 10,
        total: 30,
      });

      expect(sut).toBeDefined();
      expect(sut).toBeInstanceOf(FeatureFlagCollectionPresenter);
      expect(sut.data).toHaveLength(1);
      expect(sut.data[0]).toBeInstanceOf(FeatureFlagPresenter);
      expect(sut.meta).toBeDefined();
      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
    });

    it('Should present the date as expected', () => {
      const sut = new FeatureFlagCollectionPresenter({
        items: [props],
        currentPage: 2,
        lastPage: 3,
        perPage: 10,
        total: 30,
      });

      const output = instanceToPlain(sut);
    });
  });
});
