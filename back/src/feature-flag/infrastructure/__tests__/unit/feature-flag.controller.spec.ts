import { FeatureFlagController } from '@/feature-flag/infrastructure/feature-flag.controller';
import { FeatureFlagOutput } from '@/feature-flag/application/dtos/feature-flag-output';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { ListFeatureFlagsDto } from '@/feature-flag/infrastructure/dtos/list-feature-flag.dto';
import { UpdateFeatureFlagDto } from '@/feature-flag/infrastructure/dtos/update-feature-flag.dto';
import { faker } from '@faker-js/faker';
import {
  FeatureFlagCollectionPresenter,
  FeatureFlagPresenter,
} from '@/feature-flag/infrastructure/presenters/feature-flag.presenter';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';

describe('FeatureFlagController unit tests', () => {
  let sut: FeatureFlagController;
  let id: string;
  let props: FeatureFlagOutput;

  beforeEach(() => {
    sut = new FeatureFlagController();
    props = {
      id: '5ea0320a-3483-42d4-be62-48e29b9a631d',
      ...FeatureFlagDataBuilder({}),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should list feature flags', async () => {
    const featureFlags = [props];
    const output: ListFeatureFlagsUsecase.Output = {
      items: featureFlags,
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 1,
    };

    const mockListFeatureFlagsUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };

    sut['listFeatureFlagsUseCase'] = mockListFeatureFlagsUseCase as any;

    const input: ListFeatureFlagsDto = {};
    const presenter = await sut.search(input);
    expect(presenter).toBeInstanceOf(FeatureFlagCollectionPresenter);
    expect(presenter).toEqual(new FeatureFlagCollectionPresenter(output));
    expect(mockListFeatureFlagsUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should return a single feature flag by ID', async () => {
    const mockGetFeatureFlagUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(props)),
    };

    sut['getFeatureFlagUseCase'] = mockGetFeatureFlagUseCase as any;

    const presenter = await sut.findOne(id);
    expect(presenter).toBeInstanceOf(FeatureFlagPresenter);
    expect(presenter).toMatchObject(new FeatureFlagPresenter(props));
  });

  it('should update feature flag data', async () => {
    const updatedProps = { ...props, name: faker.person.fullName() };
    const mockUpdateFeatureFlagUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(updatedProps)),
    };

    sut['updateFeatureFlagUseCase'] = mockUpdateFeatureFlagUseCase as any;

    const input: UpdateFeatureFlagDto = updatedProps;

    const presenter = await sut.update(id, input);
    expect(presenter).toBeInstanceOf(FeatureFlagPresenter);
    expect(presenter).toMatchObject(new FeatureFlagPresenter(updatedProps));
    expect(mockUpdateFeatureFlagUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should delete a featureflag by ID', async () => {
    const mockDeleteFeatureFlagUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve()),
    };

    sut['deleteFeatureFlagUseCase'] = mockDeleteFeatureFlagUseCase as any;

    await sut.remove(id);
    expect(mockDeleteFeatureFlagUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
