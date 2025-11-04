import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Put,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UpdateAppUserUsecase } from '@/app-user/application/usecases/update-app-user.usecase';
import { GetAppUserUsecase } from '@/app-user/application/usecases/get-app-user.usecase';
import { DeleteAppUserUsecase } from '@/app-user/application/usecases/delete-app-user.usecase';
import { UpdateAppUserDto } from '@/app-user/infrastructure/dtos/update-app-user.dto';
import { AppUserOutput } from '@/app-user/application/dtos/app-user-output';
import { CreateAppUserUsecase } from '../application/usecases/create-app-user.usecase';
import {
  AppUserCollectionPresenter,
  AppUserPresenter,
} from '@/app-user/infrastructure/presenters/app-user.presenter';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListAppUsersUsecase } from '@/app-user/application/usecases/list-app-user.usecase';
import { ListAppUsersDto } from '@/app-user/infrastructure/dtos/list-app-user.dto';
import { CreateAppUserDto } from './dtos/create-app-user.dto';

@ApiTags('app-user')
@Controller('app-user')
export class AppUserController {
  @Inject(UpdateAppUserUsecase.UseCase)
  private updateAppUserUseCase: UpdateAppUserUsecase.UseCase;

  @Inject(CreateAppUserUsecase.UseCase)
  private createAppUserUseCase: CreateAppUserUsecase.UseCase;

  @Inject(GetAppUserUsecase.UseCase)
  private getAppUserUseCase: GetAppUserUsecase.UseCase;

  @Inject(ListAppUsersUsecase.UseCase)
  private listAppUsersUseCase: ListAppUsersUsecase.UseCase;

  @Inject(DeleteAppUserUsecase.UseCase)
  private deleteAppUserUseCase: DeleteAppUserUsecase.UseCase;

  @Inject(AuthService)
  private authService: AuthService;

  static appUserToResponse(output: AppUserOutput): AppUserPresenter {
    return new AppUserPresenter(output);
  }

  static listAppUserToResponse(
    output: ListAppUsersUsecase.Output,
  ): AppUserCollectionPresenter {
    return new AppUserCollectionPresenter(output);
  }

  @ApiOkResponse({
    description: 'The AppUser has been successfully created.',
    type: AppUserCollectionPresenter,
  })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchParams: ListAppUsersDto) {
    const result = await this.listAppUsersUseCase.execute(searchParams);

    return AppUserController.listAppUserToResponse(result);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'AppUser not found' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getAppUserUseCase.execute({ id });

    return AppUserController.appUserToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 404, description: 'AppUser not found' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppUserDto: UpdateAppUserDto,
  ) {
    const output = await this.updateAppUserUseCase.execute({
      id,
      ...updateAppUserDto,
    });

    return AppUserController.appUserToResponse(output);
  }

  @ApiResponse({ status: 201, description: 'App user created' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @Post()
  async create(
    @Body() createAppUserDto: CreateAppUserDto,
  ) {
    const input: CreateAppUserUsecase.Input = {
      ...createAppUserDto
    };

    const output = await this.createAppUserUseCase.execute(input);

    return AppUserController.appUserToResponse(output);
  }


  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'AppUser not found' })
  @ApiResponse({ status: 204, description: 'AppUser deleted' })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteAppUserUseCase.execute({ id });
  }
}
