import { AppUserInMemoryRepository } from '@/app-user/infrastructure/database/in-memory/repositories/app-user-in-memory.repository';
import { GetAppUserUsecase } from '@/app-user/application/usecases/get-app-user.usecase';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { AppUserWithIdNotFoundError } from '@/app-user/infrastructure/errors/app-user-with-id-not-found-error';

describe('Get app user use case test', () => {
  let sut: GetAppUserUsecase.UseCase;
  let repository: AppUserInMemoryRepository;

  beforeEach(() => {
    repository = new AppUserInMemoryRepository();
    sut = new GetAppUserUsecase.UseCase(repository);
  });

  it('should throw AppUserWithEmailNotFoundError if appUser does not exist', async () => {
    const input = { id: 'non-existent-id' };

    await expect(sut.execute(input)).rejects.toThrow(
      new AppUserWithIdNotFoundError(input.id),
    );
  });

  it('should return app user details if app user exists', async () => {
    const appUser = new AppUserEntity(AppUserDataBuilder({}));
    await repository.insert(appUser);

    const input = { id: appUser.id };

    const result = await sut.execute(input);

    expect(result).toStrictEqual(appUser.toJSON());
  });

  it('should call repository findById with correct ID', async () => {
    const appUser = new AppUserEntity(AppUserDataBuilder({}));
    await repository.insert(appUser);

    const spyFindById = jest.spyOn(repository, 'findById');

    const input = { id: appUser.id };

    await sut.execute(input);

    expect(spyFindById).toHaveBeenCalledWith(appUser.id);
  });
});
