import { PrismaClient, User } from '@prisma/client';
import { UserEntity, UserProps } from '@/user/domain/entities/user.entity';
import { UserModelMapper } from '@/user/infrastructure/database/prisma/models/user-model.mapper';
import { UserDataBuilder } from '@/user/domain/testing/helper/user-data-builder';

export class UserPrismaTestingHelper {
  static async createUser(
    prisma: PrismaClient,
    props: Partial<UserProps> = {},
  ): Promise<User> {
    return prisma.user.create({
      data: {
        ...UserDataBuilder(props)
      },
    });
  }

  static async createUserAsEntity(
    prisma: PrismaClient,
    props: Partial<UserProps> = {},
  ): Promise<UserEntity> {
    const user = await this.createUser(prisma, props);
    return UserModelMapper.toEntity(user);
  }
}
