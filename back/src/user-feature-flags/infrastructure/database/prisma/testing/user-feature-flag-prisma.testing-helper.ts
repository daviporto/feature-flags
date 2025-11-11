import { UserFeatureFlagsProps } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { PrismaClient } from '@prisma/client';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';
import { UserFeatureFlagsModelMapper } from '../models/user-feature-flags-model.mapper';
import { FeatureFlagPrismaTestingHelper } from '@/feature-flag/infrastructure/database/prisma/testing/feature-flag-prisma.testing-helper';
import { AppUserPrismaTestingHelper } from '@/app-user/infrastructure/database/prisma/testing/app-user-prisma.testing-helper';

export class UserFeatureFlagPrismaTestingHelper {
  static async createUserFeatureFlag(
    prisma: PrismaClient,
    props: Partial<UserFeatureFlagsProps> = {},
  ) {
    if (props.featureFlagId === undefined) {
      const featureFlag = await FeatureFlagPrismaTestingHelper.createFeatureFlag(
        prisma,
      );
      props.featureFlagId = featureFlag.id;
    }

    if (props.userId === undefined) {
      const appUser = await AppUserPrismaTestingHelper.createAppUser(prisma);
      props.userId = appUser.id;
    }

    return prisma.userFeatureFlag.create({
      data: UserFeatureFlagsDataBuilder(props),
    });
  }

  static async createUserFeatureFlagAsEntity(
    prisma: PrismaClient,
    props: Partial<UserFeatureFlagsProps> = {},
  ) {
    const userFeatureFlag = await this.createUserFeatureFlag(prisma, props);

    return UserFeatureFlagsModelMapper.toEntity(userFeatureFlag);
  }
}
