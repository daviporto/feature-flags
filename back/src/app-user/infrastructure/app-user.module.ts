import { Module } from '@nestjs/common';
import { AppUserController } from './app-user.controller';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { GetAppUserUsecase } from '@/app-user/application/usecases/get-app-user.usecase';
import { ListAppUsersUsecase } from '@/app-user/application/usecases/list-app-user.usecase';
import { UpdateAppUserUsecase } from '@/app-user/application/usecases/update-app-user.usecase';
import { DeleteAppUserUsecase } from '@/app-user/application/usecases/delete-app-user.usecase';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { AppUserPrismaRepository } from '@/app-user/infrastructure/database/prisma/repositories/app-user-prisma.repository';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import { CreateAppUserUsecase } from '@/app-user/application/usecases/create-app-user.usecase';

@Module({
  imports: [AuthModule],
  controllers: [AppUserController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'AppUserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new AppUserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: GetAppUserUsecase.UseCase,
      useFactory: (appUserRepository: AppUserRepository.Repository) => {
        return new GetAppUserUsecase.UseCase(appUserRepository);
      },
      inject: ['AppUserRepository'],
    },
    {
      provide: ListAppUsersUsecase.UseCase,
      useFactory: (appUserRepository: AppUserRepository.Repository) => {
        return new ListAppUsersUsecase.UseCase(appUserRepository);
      },
      inject: ['AppUserRepository'],
    },
    {
      provide: UpdateAppUserUsecase.UseCase,
      useFactory: (appUserRepository: AppUserRepository.Repository) => {
        return new UpdateAppUserUsecase.UseCase(appUserRepository);
      },
      inject: ['AppUserRepository'],
    },
    {
      provide: DeleteAppUserUsecase.UseCase,
      useFactory: (appUserRepository: AppUserRepository.Repository) => {
        return new DeleteAppUserUsecase.UseCase(appUserRepository);
      },
      inject: ['AppUserRepository'],
    },
    {
      provide: CreateAppUserUsecase.UseCase,
      useFactory: (appUserRepository: AppUserRepository.Repository) => {
        return new CreateAppUserUsecase.UseCase(appUserRepository);
      },
      inject: ['AppUserRepository'],
    },
  ],
})
export class AppUserModule {}
