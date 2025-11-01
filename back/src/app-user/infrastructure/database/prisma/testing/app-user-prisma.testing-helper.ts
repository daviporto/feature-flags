import { AppUserProps } from '@/app-user/domain/entities/app-user.entity';
import { PrismaClient } from '@prisma/client';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { AppUserModelMapper } from '@/app-user/infrastructure/database/prisma/models/app-user-model.mapper';

export class AppUserPrismaTestingHelper {
  static async createAppUser(
    prisma: PrismaClient,
    props: Partial<AppUserProps> = {},
  ) {
    return prisma.appUser.create({
      data: AppUserDataBuilder(props),
    });
  }

  static async createAppUserAsEntity(
    prisma: PrismaClient,
    props: Partial<AppUserProps> = {},
  ) {
    const appUser = await this.createAppUser(prisma, props);

    return AppUserModelMapper.toEntity(appUser);
  }
}
