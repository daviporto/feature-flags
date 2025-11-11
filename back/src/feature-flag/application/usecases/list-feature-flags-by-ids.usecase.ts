import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import {
  FeatureFlagOutput,
  FeatureFlagOutputMapper,
} from '@/feature-flag/application/dtos/feature-flag-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';
import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import { UserFeatureFlagsOutputMapper } from '@/user-feature-flags/application/dtos/user-feature-flags-output';

export namespace ListFeatureFlagsByIdsUsecase {
  export type Input = {
    ids: string[];
    appUserId?: string;
  };

  export type Output = ListFeatureFlagsUsecase.Output;

  export class UseCase
    implements UseCaseInterface<Input, ListFeatureFlagsByIdsUsecase.Output>
  {
    constructor(
      private featureFlagRepository: FeatureFlagRepository.Repository,
      private userFeatureFlagsRepository: UserFeatureFlagsRepository.Repository,
    ) {}

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

      const entities = await this.featureFlagRepository.findByIds(
        uniqueIds,
        input.appUserId,
      );

      const items = entities.map<FeatureFlagOutput>((featureFlag) =>
        FeatureFlagOutputMapper.toOutput(featureFlag),
      );

      if (input.appUserId) {
        const searchParams =
          new UserFeatureFlagsRepository.SearchParams({
            page: 1,
            perPage: Math.max(uniqueIds.length, 10),
            filter: {
              userId: input.appUserId,
            },
          });

        const targetUsersSearch =
          await this.userFeatureFlagsRepository.search(searchParams);

        const targetUsersMap = targetUsersSearch.items.reduce<
          Record<string, ReturnType<typeof UserFeatureFlagsOutputMapper.toOutput>>
        >((acc, userFeatureFlag) => {
          acc[userFeatureFlag.featureFlagId] =
            UserFeatureFlagsOutputMapper.toOutput(userFeatureFlag);
          return acc;
        }, {});

        items.forEach((item) => {
          const targetUser = targetUsersMap[item.id];
          if (targetUser) {
            (item as FeatureFlagOutput & {
              targetUser: ReturnType<
                typeof UserFeatureFlagsOutputMapper.toOutput
              >;
            }).targetUser = targetUser;
          }
        });
      }

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

