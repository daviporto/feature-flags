import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';
import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import { AbstractListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/abstract-list-feature-flag-usecase';

export namespace ListFeatureFlagsByNamesUsecase {
  export interface Input extends AbstractListFeatureFlagsUsecase.Input {
    names: string[];
  }

  export type Output = ListFeatureFlagsUsecase.Output;

  export class UseCase
    extends AbstractListFeatureFlagsUsecase.AbstractListFeatureFlagUsecase
    implements UseCaseInterface<Input, ListFeatureFlagsByNamesUsecase.Output>
  {
    async execute(
      input: Input,
    ): Promise<ListFeatureFlagsByNamesUsecase.Output> {
      const uniqueNames = Array.from(
        new Set(
          input.names
            ?.map((name) => name?.trim())
            .filter((name): name is string => Boolean(name && name.length)) ??
            [],
        ),
      );

      if (!uniqueNames.length) {
        return {
          items: [],
          total: 0,
          currentPage: 1,
          lastPage: 1,
          perPage: 0,
        };
      }

      const entities = await this.featureFlagRepository.findByNames(
        uniqueNames,
        input.appUserId,
      );

      return await this.filterByAppUser(entities, input, uniqueNames.length);
    }
  }
}
