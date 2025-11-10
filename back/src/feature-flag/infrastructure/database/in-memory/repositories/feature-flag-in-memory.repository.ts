import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';

export class FeatureFlagInMemoryRepository
  extends InMemoryRepository<FeatureFlagEntity>
  implements FeatureFlagRepository.Repository
{
  sortableFields: string[] = FeatureFlagRepository.sortableFields;

  async search(
    params: FeatureFlagRepository.SearchParams,
  ): Promise<FeatureFlagRepository.SearchResult> {
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

  protected async _get(id: string): Promise<FeatureFlagEntity> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      throw new FeatureFlagWithIdNotFoundError(id);
    }

    return item;
  }

  protected async _getIndex(id: string): Promise<number> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new FeatureFlagWithIdNotFoundError(id);
    }

    return index;
  }

  assureFeatureFlagExists(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new FeatureFlagWithIdNotFoundError(id);
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

  async findByIds(
    ids: string[],
    _appUserId?: string,
  ): Promise<FeatureFlagEntity[]> {
    if (!ids?.length) {
      return [];
    }

    const normalizedIds = new Set(
      ids
        .map((id) => id?.trim())
        .filter((id): id is string => Boolean(id && id.length)),
    );

    if (!normalizedIds.size) {
      return [];
    }

    return this.items.filter((item) => normalizedIds.has(item.id));
  }
}
