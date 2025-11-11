import { Module } from '@nestjs/common';
import { UserFeatureFlagsController } from './user-feature-flags.controller';
import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import { GetUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/get-user-feature-flags.usecase';
import { ListUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/list-user-feature-flags.usecase';
import { UpdateUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/update-user-feature-flags.usecase';
import { DeleteUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/delete-user-feature-flags.usecase';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserFeatureFlagsPrismaRepository } from '@/user-feature-flags/infrastructure/database/prisma/repositories/user-feature-flags-prisma.repository';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import { CreateUserFeatureFlagsUsecase } from '../application/usecases/create-user-feature-flags.usecase';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { AppUserPrismaRepository } from '@/app-user/infrastructure/database/prisma/repositories/app-user-prisma.repository';

@Module({
  imports: [AuthModule],
  controllers: [UserFeatureFlagsController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserFeatureFlagsRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserFeatureFlagsPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: GetUserFeatureFlagsUsecase.UseCase,
      useFactory: (
        userFeatureFlagsRepository: UserFeatureFlagsRepository.Repository,
      ) => {
        return new GetUserFeatureFlagsUsecase.UseCase(
          userFeatureFlagsRepository,
        );
      },
      inject: ['UserFeatureFlagsRepository'],
    },
    {
      provide: ListUserFeatureFlagsUsecase.UseCase,
      useFactory: (
        userFeatureFlagsRepository: UserFeatureFlagsRepository.Repository,
      ) => {
        return new ListUserFeatureFlagsUsecase.UseCase(
          userFeatureFlagsRepository,
        );
      },
      inject: ['UserFeatureFlagsRepository'],
    },
    {
      provide: UpdateUserFeatureFlagsUsecase.UseCase,
      useFactory: (
        userFeatureFlagsRepository: UserFeatureFlagsRepository.Repository,
      ) => {
        return new UpdateUserFeatureFlagsUsecase.UseCase(
          userFeatureFlagsRepository,
        );
      },
      inject: ['UserFeatureFlagsRepository'],
    },
    {
      provide: DeleteUserFeatureFlagsUsecase.UseCase,
      useFactory: (
        userFeatureFlagsRepository: UserFeatureFlagsRepository.Repository,
      ) => {
        return new DeleteUserFeatureFlagsUsecase.UseCase(
          userFeatureFlagsRepository,
        );
      },
      inject: ['UserFeatureFlagsRepository'],
    },
    {
      provide: 'FeatureFlagRepository',
      useFactory: (prismaService: PrismaService) => {
        return new FeatureFlagPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'AppUserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new AppUserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreateUserFeatureFlagsUsecase.UseCase,
      useFactory: (
        userFeatureFlagRepository: UserFeatureFlagsRepository.Repository,
        featureFlagRepository: FeatureFlagRepository.Repository,
        userRepository: AppUserRepository.Repository,
      ) => {
        return new CreateUserFeatureFlagsUsecase.UseCase(
          userFeatureFlagRepository,
          featureFlagRepository,
          userRepository,
        );
      },
      inject: [
        'UserFeatureFlagsRepository',
        'FeatureFlagRepository',
        'AppUserRepository',
      ],
    },
  ],
})
export class UserFeatureFlagsModule {}
