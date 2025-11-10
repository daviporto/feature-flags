import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts';
import { UserFeatureFlagsWithIdNotFoundError } from '@/user-feature-flags/infrastructure/errors/user-feature-flags-with-id-not-found-error';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';

export class UserFeatureFlagsInMemoryRepository
  extends InMemoryRepository<UserFeatureFlagsEntity>
  implements UserFeatureFlagsRepository.Repository
{
  sortableFields: string[] = UserFeatureFlagsRepository.sortableFields;

  async search(
    params: UserFeatureFlagsRepository.SearchParams,
  ): Promise<UserFeatureFlagsRepository.SearchResult> {
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

  protected async _get(id: string): Promise<UserFeatureFlagsEntity> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      throw new UserFeatureFlagsWithIdNotFoundError(id);
    }

    return item;
  }

  protected async _getIndex(id: string): Promise<number> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new UserFeatureFlagsWithIdNotFoundError(id);
    }

    return index;
  }

  assureUserFeatureFlagExists(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new UserFeatureFlagsWithIdNotFoundError(id);
    }

    return Promise.resolve();
  }

  async enable(id: string): Promise<void> {
    const index = await this._getIndex(id);

    this.items[index].enable();
  }

  async disable(id: string): Promise<void> {
    const index = await this._getIndex(id);

    this.items[index].disable();
  }
}
