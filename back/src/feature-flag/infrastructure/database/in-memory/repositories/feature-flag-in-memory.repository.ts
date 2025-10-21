import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { FeatureFlagWithEmailNotFoundError } from '@/feature-flag/domain/errors/feature-flag-with-email-not-found-error';
import { EmailAlreadyInUseError } from '@/feature-flag/domain/errors/email-already-in-use-error';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';

export class FeatureFlagInMemoryRepository
  extends InMemorySearchableRepository<FeatureFlagEntity>
  implements FeatureFlagRepository.Repository
{
  sortableFields = [];

  protected async applyFilters(
    items: FeatureFlagEntity[],
    filter: string | null,
  ): Promise<FeatureFlagEntity[]> {
    if (!filter) return items;

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected async applySort(
    items: FeatureFlagEntity[],
    sort: string | null,
    sortDir: SortOrderEnum | null,
  ): Promise<FeatureFlagEntity[]> {
    if (!sort) {
      sort = 'createdAt';
    }

    if (!sortDir) {
      sortDir = SortOrderEnum.DESC;
    }

    return super.applySort(items, sort, sortDir);
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
}
