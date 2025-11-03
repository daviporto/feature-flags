import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { SearchInput } from '@/shared/application/dtos/search-input';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { AppUserOutputMapper } from '@/app-user/application/dtos/app-user-output';

export namespace ListAppUsersUsecase {
  export type Input = SearchInput<AppUserRepository.Filter>;

  export type Output = PaginationOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: AppUserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new AppUserRepository.SearchParams(input);

      const searchResult = await this.repository.search(params);

      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: AppUserRepository.SearchResult): Output {
      const item = searchResult.items.map((appUser) =>
        AppUserOutputMapper.toOutput(appUser),
      );

      return PaginationOutputMapper.toOutput(item, searchResult);
    }
  }
}
