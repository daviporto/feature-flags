import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts';
import { AppUserWithIdNotFoundError } from '@/app-user/infrastructure/errors/app-user-with-id-not-found-error';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';

export class AppUserInMemoryRepository
  extends InMemoryRepository<AppUserEntity>
  implements AppUserRepository.Repository
{
  sortableFields: string[] = AppUserRepository.sortableFields;

  async search(
    params: AppUserRepository.SearchParams,
  ): Promise<AppUserRepository.SearchResult> {
    return new SearchResult({
      items: this.items,
      total: this.items.length,
      currentPage: params.page,
      perPage: params.perPage,
      sort: params.sort,
      sortDir: params.sortDir,
      filter: params.filter,
    });
  }

  protected async _get(id: string): Promise<AppUserEntity> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      throw new AppUserWithIdNotFoundError(id);
    }

    return item;
  }

  protected async _getIndex(id: string): Promise<number> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new AppUserWithIdNotFoundError(id);
    }

    return index;
  }

  assureAppUserExists(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new AppUserWithIdNotFoundError(id);
    }

    return Promise.resolve();
  }
}
