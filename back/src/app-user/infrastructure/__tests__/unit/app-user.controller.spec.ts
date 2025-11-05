import { AppUserController } from '@/app-user/infrastructure/app-user.controller';
import { AppUserOutput } from '@/app-user/application/dtos/app-user-output';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { ListAppUsersDto } from '@/app-user/infrastructure/dtos/list-app-user.dto';
import { UpdateAppUserDto } from '@/app-user/infrastructure/dtos/update-app-user.dto';
import { CreateAppUserDto } from '@/app-user/infrastructure/dtos/create-app-user.dto';
import { faker } from '@faker-js/faker';
import {
  AppUserCollectionPresenter,
  AppUserPresenter,
} from '@/app-user/infrastructure/presenters/app-user.presenter';
import { ListAppUsersUsecase } from '@/app-user/application/usecases/list-app-user.usecase';

describe('AppUserController unit tests', () => {
  let sut: AppUserController;
  let id: string;
  let props: AppUserOutput;

  beforeEach(() => {
    sut = new AppUserController();
    id = '5ea0320a-3483-42d4-be62-48e29b9a631d';
    props = {
      id,
      ...AppUserDataBuilder({}),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should list appusers', async () => {
    const appUsers = [props];
    const output: ListAppUsersUsecase.Output = {
      items: appUsers,
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 1,
    };

    const mockListAppUsersUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };

    sut['listAppUsersUseCase'] = mockListAppUsersUseCase as any;

    const input: ListAppUsersDto = {};
    const presenter = await sut.search(input);
    expect(presenter).toBeInstanceOf(AppUserCollectionPresenter);
    expect(presenter).toEqual(new AppUserCollectionPresenter(output));
    expect(mockListAppUsersUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should return a single appuser by ID', async () => {
    const mockGetAppUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(props)),
    };

    sut['getAppUserUseCase'] = mockGetAppUserUseCase as any;

    const presenter = await sut.findOne(id);
    expect(presenter).toBeInstanceOf(AppUserPresenter);
    expect(presenter).toEqual(new AppUserPresenter(props));
    expect(mockGetAppUserUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('should update appuser data', async () => {
    const updatedProps = { ...props, name: faker.person.fullName() };
    const mockUpdateAppUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(updatedProps)),
    };

    sut['updateAppUserUseCase'] = mockUpdateAppUserUseCase as any;

    const input: UpdateAppUserDto = {
      name: updatedProps.name,
      email: updatedProps.email,
      externalId: updatedProps.externalId,
    };

    const presenter = await sut.update(id, input);
    expect(presenter).toBeInstanceOf(AppUserPresenter);
    expect(presenter).toEqual(new AppUserPresenter(updatedProps));
    expect(mockUpdateAppUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should create app user', async () => {
    const createProps = { ...props };
    const mockCreateAppUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(createProps)),
    };

    sut['createAppUserUseCase'] = mockCreateAppUserUseCase as any;

    const input: CreateAppUserDto = createProps;

    const presenter = await sut.create(input);
    expect(presenter).toBeInstanceOf(AppUserPresenter);
    expect(presenter).toMatchObject(new AppUserPresenter(createProps));
    expect(mockCreateAppUserUseCase.execute).toHaveBeenCalledWith({
      ...input,
    });
  });

  it('should delete a appuser by ID', async () => {
    const mockDeleteAppUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve()),
    };

    sut['deleteAppUserUseCase'] = mockDeleteAppUserUseCase as any;

    await sut.remove(id);
    expect(mockDeleteAppUserUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
