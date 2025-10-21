import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';

export namespace FeatureFlagRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<FeatureFlagEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      FeatureFlagEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
  }
}
