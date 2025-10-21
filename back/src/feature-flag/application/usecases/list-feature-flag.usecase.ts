import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { SearchInput } from '@/shared/application/dtos/search-input';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { FeatureFlagOutputMapper } from '@/feature-flag/application/dtos/feature-flag-output';

export namespace ListFeatureFlagsUsecase {
  export type Input = SearchInput;

  export type Output = PaginationOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: FeatureFlagRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new FeatureFlagRepository.SearchParams(input);

      const searchResult = await this.repository.search(params);

      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: FeatureFlagRepository.SearchResult): Output {
      const item = searchResult.items.map((feature-flag) =>
        FeatureFlagOutputMapper.toOutput(feature-flag),
      );

      return PaginationOutputMapper.toOutput(item, searchResult);
    }
  }
}
