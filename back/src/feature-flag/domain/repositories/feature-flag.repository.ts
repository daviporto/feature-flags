import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';

export namespace FeatureFlagRepository {
  export type Filter = {
    name?: string;
    description?: string;
    enabled?: boolean;
  };

  export const sortableFields = ['name', 'description', 'enabled'];

  export const defaultSortField = 'createdAt';

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<
    FeatureFlagEntity,
    Filter
  > {}

  export interface Repository
    extends SearchableRepositoryInterface<
      FeatureFlagEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    enable(id: string): Promise<void>;

    disable(id: string): Promise<void>;

    assureFeatureFlagExists(id: string): Promise<void>;
  }
}
