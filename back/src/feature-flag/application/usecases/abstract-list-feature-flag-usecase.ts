import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import {
  FeatureFlagOutput,
  FeatureFlagOutputMapper,
} from '@/feature-flag/application/dtos/feature-flag-output';
import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import { UserFeatureFlagsOutputMapper } from '@/user-feature-flags/application/dtos/user-feature-flags-output';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';

export namespace AbstractListFeatureFlagsUsecase {
  export interface Input {
    appUserId?: string;
  }

  export class AbstractListFeatureFlagUsecase {
    constructor(
      protected featureFlagRepository: FeatureFlagRepository.Repository,
      protected userFeatureFlagsRepository: UserFeatureFlagsRepository.Repository,
      protected appUserRepository: AppUserRepository.Repository,
    ) {}

    protected async filterByAppUser(
      entities: FeatureFlagEntity[],
      input: Input,
      lenght: number,
    ) {
      const items = entities.map<FeatureFlagOutput>((featureFlag) =>
        FeatureFlagOutputMapper.toOutput(featureFlag),
      );

      if (input.appUserId) {
        const appUserId = await this.appUserRepository.findIdByExternalId(
          input.appUserId,
        );

        const searchParams = new UserFeatureFlagsRepository.SearchParams({
          page: 1,
          perPage: Math.max(lenght, 10),
          filter: {
            userId: appUserId,
          },
        });

        const targetUsersSearch =
          await this.userFeatureFlagsRepository.search(searchParams);

        const targetUsersMap = targetUsersSearch.items.reduce<
          Record<
            string,
            ReturnType<typeof UserFeatureFlagsOutputMapper.toOutput>
          >
        >((acc, userFeatureFlag) => {
          acc[userFeatureFlag.featureFlagId] =
            UserFeatureFlagsOutputMapper.toOutput(userFeatureFlag);
          return acc;
        }, {});

        items.forEach((item) => {
          const targetUser = targetUsersMap[item.id];
          if (targetUser) {
            (
              item as FeatureFlagOutput & {
                targetUser: ReturnType<
                  typeof UserFeatureFlagsOutputMapper.toOutput
                >;
              }
            ).targetUser = targetUser;
          }
        });
      }

      return {
        items,
        total: items.length,
        currentPage: 1,
        lastPage: 1,
        perPage: items.length || lenght,
      };
    }
  }
}
