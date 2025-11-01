import { ListAppUsersUsecase } from '@/app-user/application/usecases/list-app-user.usecase';
import { AppUserInMemoryRepository } from '@/app-user/infrastructure/database/in-memory/repositories/app-user-in-memory.repository';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';

describe('List appusers use cases unit tests', () => {
  let sut: ListAppUsersUsecase.UseCase;
  let repository: AppUserInMemoryRepository;

  beforeEach(() => {
    repository = new AppUserInMemoryRepository();
    sut = new ListAppUsersUsecase.UseCase(repository);
  });

  describe('test to output', () => {
    it('should return empty result in output', () => {
      const result = new AppUserRepository.SearchResult({
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

    it('should return app user entity result in output', () => {
      const entity = new AppUserEntity(AppUserDataBuilder({}));
      const result = new AppUserRepository.SearchResult({
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
});
