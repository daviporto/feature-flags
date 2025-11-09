import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { SearchInput } from '@/shared/application/dtos/search-input';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { UserFeatureFlagsOutputMapper } from '@/user-feature-flags/application/dtos/user-feature-flags-output';

export namespace ListUserFeatureFlagsUsecase {
  export type Input = SearchInput<UserFeatureFlagsRepository.Filter>;

  export type Output = PaginationOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: UserFeatureFlagsRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new UserFeatureFlagsRepository.SearchParams(input);

      const searchResult = await this.repository.search(params);

      return this.toOutput(searchResult);
    }

    private toOutput(
      searchResult: UserFeatureFlagsRepository.SearchResult,
    ): Output {
      const item = searchResult.items.map((userFeatureFlags) =>
        UserFeatureFlagsOutputMapper.toOutput(userFeatureFlags),
      );

      return PaginationOutputMapper.toOutput(item, searchResult);
    }
  }
}
