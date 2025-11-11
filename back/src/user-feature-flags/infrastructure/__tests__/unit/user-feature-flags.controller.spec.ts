import { UserFeatureFlagsController } from '@/user-feature-flags/infrastructure/user-feature-flags.controller';
import { UserFeatureFlagsOutput } from '@/user-feature-flags/application/dtos/user-feature-flags-output';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';
import { ListUserFeatureFlagsDto } from '@/user-feature-flags/infrastructure/dtos/list-user-feature-flags.dto';
import { UpdateUserFeatureFlagsDto } from '@/user-feature-flags/infrastructure/dtos/update-user-feature-flags.dto';
import { faker } from '@faker-js/faker';
import {
  UserFeatureFlagsCollectionPresenter,
  UserFeatureFlagsPresenter,
} from '@/user-feature-flags/infrastructure/presenters/user-feature-flags.presenter';
import { ListUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/list-user-feature-flags.usecase';

describe('UserFeatureFlagsController unit tests', () => {
  let sut: UserFeatureFlagsController;
  let id: string;
  let props: UserFeatureFlagsOutput;

  beforeEach(() => {
    sut = new UserFeatureFlagsController();
    id = '5ea0320a-3483-42d4-be62-48e29b9a631d';
    const data = UserFeatureFlagsDataBuilder({});
    props = {
      id,
      featureFlagId: data.featureFlagId,
      userId: data.userId,
      enabled: data.enabled ?? true,
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should list user-feature-flagss', async () => {
    const userFeatureFlag = [props];
    const output: ListUserFeatureFlagsUsecase.Output = {
      items: userFeatureFlag,
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 1,
    };

    const mockListUserFeatureFlagsUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };

    sut['listUserFeatureFlagsUseCase'] =
      mockListUserFeatureFlagsUseCase as any;

    const input: ListUserFeatureFlagsDto = {};
    const presenter = await sut.search(input);
    expect(presenter).toBeInstanceOf(UserFeatureFlagsCollectionPresenter);
    expect(presenter).toEqual(new UserFeatureFlagsCollectionPresenter(output));
    expect(mockListUserFeatureFlagsUseCase.execute).toHaveBeenCalledWith(
      input,
    );
  });

  it('should return a single user-feature-flags by ID', async () => {
    const mockGetUserFeatureFlagsUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(props)),
    };

    sut['getUserFeatureFlagsUseCase'] = mockGetUserFeatureFlagsUseCase as any;

    const presenter = await sut.findOne(id);
    expect(presenter).toBeInstanceOf(UserFeatureFlagsPresenter);
    expect(presenter).toMatchObject(new UserFeatureFlagsPresenter(props));
  });

  it('should update user-feature-flags data', async () => {
    const updatedProps = { ...props, enabled: faker.datatype.boolean() };
    const mockUpdateUserFeatureFlagsUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(updatedProps)),
    };

    sut['updateUserFeatureFlagsUseCase'] =
      mockUpdateUserFeatureFlagsUseCase as any;

    const input: UpdateUserFeatureFlagsDto = updatedProps;

    const presenter = await sut.update(id, input);
    expect(presenter).toBeInstanceOf(UserFeatureFlagsPresenter);
    expect(presenter).toMatchObject(
      new UserFeatureFlagsPresenter(updatedProps),
    );
    expect(mockUpdateUserFeatureFlagsUseCase.execute).toHaveBeenCalledWith(
      input,
    );
  });

  it('should delete a user-feature-flags by ID', async () => {
    const mockDeleteUserFeatureFlagsUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve()),
    };

    sut['deleteUserFeatureFlagsUseCase'] =
      mockDeleteUserFeatureFlagsUseCase as any;

    await sut.remove(id);
    expect(mockDeleteUserFeatureFlagsUseCase.execute).toHaveBeenCalledWith({
      id,
    });
  });
});
