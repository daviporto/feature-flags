import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';

export namespace UserFeatureFlagsRepository {
  export type Filter = {
    userId?: string;
    featureFlagId?: string;
    enabled?: boolean;
  };

  export const sortableFields = ['userId', 'featureFlagId', 'enabled'];

  export const defaultSortField = 'featureFlagId';

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<
    UserFeatureFlagsEntity,
    Filter
  > {}

  export interface Repository
    extends SearchableRepositoryInterface<
      UserFeatureFlagsEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    enable(id: string): Promise<void>;

    disable(id: string): Promise<void>;

    assureUserFeatureFlagExists(id: string): Promise<void>;
  }
}
