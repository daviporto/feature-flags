import { AppUserInMemoryRepository } from '@/app-user/infrastructure/database/in-memory/repositories/app-user-in-memory.repository';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { DeleteAppUserUsecase } from '@/app-user/application/usecases/delete-app-user.usecase';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';

describe('Delete app user use case test', () => {
  let sut: DeleteAppUserUsecase.UseCase;
  let repository: AppUserInMemoryRepository;

  beforeEach(() => {
    repository = new AppUserInMemoryRepository();
    sut = new DeleteAppUserUsecase.UseCase(repository);
  });

  it('should throw exception if app user does not exist', async () => {
    const input = { id: 'non-existent-id' };

    await expect(sut.execute(input)).rejects.toThrow();
  });

  it('should call repository delete with correct ID', async () => {
    const appUser = new AppUserEntity(AppUserDataBuilder());
    await repository.insert(appUser);

    const spyDelete = jest.spyOn(repository, 'delete');

    const input = { id: appUser.id };

    expect(repository.items).toHaveLength(1);
    await sut.execute(input);

    expect(spyDelete).toHaveBeenCalledWith(appUser.id);

    expect(repository.items).toHaveLength(0);
  });
});
