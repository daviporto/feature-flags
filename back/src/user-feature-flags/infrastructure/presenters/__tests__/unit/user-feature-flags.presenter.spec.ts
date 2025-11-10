import {
  UserFeatureFlagsCollectionPresenter,
  UserFeatureFlagsPresenter,
} from '@/user-feature-flags/infrastructure/presenters/user-feature-flags.presenter';
import { instanceToPlain } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { UserFeatureFlagsOutput } from '@/user-feature-flags/application/dtos/user-feature-flags-output';
import { ListUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/list-user-feature-flags.usecase';

describe('UserFeatureFlags presenter unit tests', () => {
  describe('UserFeatureFlagsPresenter', () => {
    const enabled = faker.datatype.boolean();
    const userId = faker.string.uuid();
    const featureFlagId = faker.string.uuid();
    const id = faker.string.uuid();

    let props: UserFeatureFlagsOutput;
    let sut: UserFeatureFlagsPresenter;

    beforeEach(() => {
      props = {
        id,
        enabled,
        userId,
        featureFlagId,
      };
      sut = new UserFeatureFlagsPresenter(props);
    });

    it('Constructor', () => {
      expect(sut).toBeDefined();
      expect(sut.enabled).toEqual(props.enabled);
      expect(sut.userId).toEqual(props.userId);
      expect(sut.featureFlagId).toEqual(props.featureFlagId);
    });

    it('Should present the data as expected with transformed dates', () => {
      const output = instanceToPlain(sut);

      expect(output).toBeDefined();
      expect(output.enabled).toEqual(enabled);
      expect(output.userId).toEqual(userId);
      expect(output.featureFlagId).toEqual(featureFlagId);
    });
  });

  describe('UserFeatureFlagsCollectionPresenter', () => {
    let output: ListUserFeatureFlagsUsecase.Output;
    let sut: UserFeatureFlagsCollectionPresenter;

    beforeEach(() => {
      const items = Array.from({ length: 3 }, () => ({
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        featureFlagId: faker.string.uuid(),
        enabled: faker.datatype.boolean(),
      }));

      output = {
        items,
        total: items.length,
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
      };

      sut = new UserFeatureFlagsCollectionPresenter(output);
    });

    it('Constructor', () => {
      expect(sut).toBeDefined();
      expect(sut.data).toHaveLength(output.items.length);
      expect(sut.data[0]).toBeInstanceOf(UserFeatureFlagsPresenter);
      expect(sut.meta).toEqual({
        total: output.total,
        currentPage: output.currentPage,
        lastPage: output.lastPage,
        perPage: output.perPage,
      });
    });

    it('Should present the collection data as expected', () => {
      const presentation = instanceToPlain(sut);

      expect(presentation).toBeDefined();
      expect(presentation.meta).toEqual({
        total: output.total,
        currentPage: output.currentPage,
        lastPage: output.lastPage,
        perPage: output.perPage,
      });
      expect(presentation.data).toHaveLength(output.items.length);

      presentation.data.forEach((item: any, index: number) => {
        expect(item.id).toEqual(output.items[index].id);
        expect(item.featureFlagId).toEqual(output.items[index].featureFlagId);
        expect(item.userId).toEqual(output.items[index].userId);
        expect(item.enabled).toEqual(output.items[index].enabled);
      });
    });

    it('Should handle empty collection', () => {
      const emptyOutput: ListUserFeatureFlagsUsecase.Output = {
        items: [],
        total: 0,
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
      };

      const emptySut = new UserFeatureFlagsCollectionPresenter(emptyOutput);
      const presentation = instanceToPlain(emptySut);

      expect(presentation.data).toHaveLength(0);
      expect(presentation.meta.total).toEqual(0);
    });
  });
});
