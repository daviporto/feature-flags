import { Module } from '@nestjs/common';
import { FeatureFlagController } from './feature-flag.controller';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { GetFeatureFlagUsecase } from '@/feature-flag/application/usecases/get-feature-flag.usecase';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';
import { UpdateFeatureFlagUsecase } from '@/feature-flag/application/usecases/update-feature-flag.usecase';
import { DeleteFeatureFlagUsecase } from '@/feature-flag/application/usecases/delete-feature-flag.usecase';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { FeatureFlagPrismaRepository } from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import { CreateFeatureFlagUsecase } from '@/feature-flag/application/usecases/create-feature-flag.usecase';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { UserPrismaRepository } from '@/user/infrastructure/database/prisma/repositories/user-prisma.repository';
import { AppUserModule } from '@/app-user/infrastructure/app-user.module';
import { ClientUserService } from './client-user.service';
import { ClientFeatureFlagUsecase } from '../application/usecases/client-feature-flag.usecase';

@Module({
  imports: [AuthModule, AppUserModule],
  controllers: [FeatureFlagController],
  providers: [
    ClientUserService,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'FeatureFlagRepository',
      useFactory: (prismaService: PrismaService) => {
        return new FeatureFlagPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: GetFeatureFlagUsecase.UseCase,
      useFactory: (featureFlagRepository: FeatureFlagRepository.Repository) => {
        return new GetFeatureFlagUsecase.UseCase(featureFlagRepository);
      },
      inject: ['FeatureFlagRepository'],
    },
    {
      provide: ListFeatureFlagsUsecase.UseCase,
      useFactory: (featureFlagRepository: FeatureFlagRepository.Repository) => {
        return new ListFeatureFlagsUsecase.UseCase(featureFlagRepository);
      },
      inject: ['FeatureFlagRepository'],
    },
    {
      provide: UpdateFeatureFlagUsecase.UseCase,
      useFactory: (featureFlagRepository: FeatureFlagRepository.Repository) => {
        return new UpdateFeatureFlagUsecase.UseCase(featureFlagRepository);
      },
      inject: ['FeatureFlagRepository'],
    },
    {
      provide: DeleteFeatureFlagUsecase.UseCase,
      useFactory: (featureFlagRepository: FeatureFlagRepository.Repository) => {
        return new DeleteFeatureFlagUsecase.UseCase(featureFlagRepository);
      },
      inject: ['FeatureFlagRepository'],
    },
    {
      provide: ClientFeatureFlagUsecase.UseCase,
      useFactory: (featureFlagRepository: FeatureFlagRepository.Repository) => {
        return new ClientFeatureFlagUsecase.UseCase(featureFlagRepository);
      },
      inject: ['FeatureFlagRepository'],
    },
    {
      provide: CreateFeatureFlagUsecase.UseCase,
      useFactory: (
        featureFlagRepository: FeatureFlagRepository.Repository,
        userRepository: UserRepository.Repository,
      ) => {
        return new CreateFeatureFlagUsecase.UseCase(
          featureFlagRepository,
          userRepository,
        );
      },
      inject: ['FeatureFlagRepository', 'UserRepository'],
    },
  ],
})
export class FeatureFlagModule {}
