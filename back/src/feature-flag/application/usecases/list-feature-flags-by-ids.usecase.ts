import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { FeatureFlagOutputMapper } from '@/feature-flag/application/dtos/feature-flag-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';

export namespace ListFeatureFlagsByIdsUsecase {
  export type Input = {
    ids: string[];
    appUserId?: string;
  };

  export type Output = ListFeatureFlagsUsecase.Output;

  export class UseCase
    implements UseCaseInterface<Input, ListFeatureFlagsByIdsUsecase.Output>
  {
    constructor(private repository: FeatureFlagRepository.Repository) {}

    async execute(input: Input): Promise<ListFeatureFlagsByIdsUsecase.Output> {
      const uniqueIds = Array.from(
        new Set(
          input.ids
            ?.map((id) => id?.trim())
            .filter((id): id is string => Boolean(id && id.length)) ?? [],
        ),
      );

      if (!uniqueIds.length) {
        return {
          items: [],
          total: 0,
          currentPage: 1,
          lastPage: 1,
          perPage: 0,
        };
      }

      const entities = await this.repository.findByIds(
        uniqueIds,
        input.appUserId,
      );

      const items = entities.map((featureFlag) =>
        FeatureFlagOutputMapper.toOutput(featureFlag),
      );

      return {
        items,
        total: items.length,
        currentPage: 1,
        lastPage: 1,
        perPage: items.length || uniqueIds.length,
      };
    }
  }
}

