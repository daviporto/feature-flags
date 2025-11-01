import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from '@/shared/domain/repositories/searchable-repository-contracts';

export namespace AppUserRepository {
  export type Filter = {
    name?: string;
    email?: string;
    externalId?: string;
  };

  export const sortableFields = ['name', 'email', 'externalId', 'createdAt'];

  export const defaultSortField = 'createdAt';

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<
    AppUserEntity,
    Filter
  > {}

  export interface Repository
    extends SearchableRepositoryInterface<
      AppUserEntity,
      Filter,
      SearchParams,
      SearchResult
    > {}
}
