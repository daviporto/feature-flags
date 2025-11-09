import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/update-user-feature-flags.usecase';
import { GetUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/get-user-feature-flags.usecase';
import { ListUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/list-user-feature-flags.usecase';
import { DeleteUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/delete-user-feature-flags.usecase';
import { ListUserFeatureFlagsDto } from '@/user-feature-flags/infrastructure/dtos/list-user-feature-flags.dto';
import { UpdateUserFeatureFlagsDto } from '@/user-feature-flags/infrastructure/dtos/update-user-feature-flags.dto';
import { UserFeatureFlagsOutput } from '@/user-feature-flags/application/dtos/user-feature-flags-output';
import {
  UserFeatureFlagsCollectionPresenter,
  UserFeatureFlagsPresenter,
} from '@/user-feature-flags/infrastructure/presenters/user-feature-flags.presenter';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserFeatureFlagsDto } from './dtos/create-user-feature-flags.dto';
import { CreateUserFeatureFlagsUsecase } from '../application/usecases/create-user-feature-flags.usecase';

@ApiTags('user-feature-flags')
@Controller('user-feature-flags')
export class UserFeatureFlagsController {
  @Inject(UpdateUserFeatureFlagsUsecase.UseCase)
  private updateUserFeatureFlagsUseCase: UpdateUserFeatureFlagsUsecase.UseCase;

  @Inject(CreateUserFeatureFlagsUsecase.UseCase)
  private createUserFeatureFlagsUsecase: CreateUserFeatureFlagsUsecase.UseCase;

  @Inject(GetUserFeatureFlagsUsecase.UseCase)
  private getUserFeatureFlagsUseCase: GetUserFeatureFlagsUsecase.UseCase;

  @Inject(ListUserFeatureFlagsUsecase.UseCase)
  private listUserFeatureFlagsUseCase: ListUserFeatureFlagsUsecase.UseCase;

  @Inject(DeleteUserFeatureFlagsUsecase.UseCase)
  private deleteUserFeatureFlagsUseCase: DeleteUserFeatureFlagsUsecase.UseCase;

  @Inject(AuthService)
  private authService: AuthService;

  static userFeatureFlagsToResponse(
    output: UserFeatureFlagsOutput,
  ): UserFeatureFlagsPresenter {
    return new UserFeatureFlagsPresenter(output);
  }

  static listUserFeatureFlagsToResponse(
    output: ListUserFeatureFlagsUsecase.Output,
  ): UserFeatureFlagsCollectionPresenter {
    return new UserFeatureFlagsCollectionPresenter(output);
  }

  @ApiOkResponse({
    description: 'The UserFeatureFlags has been successfully created.',
    type: UserFeatureFlagsCollectionPresenter,
  })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchParams: ListUserFeatureFlagsDto) {
    const result = await this.listUserFeatureFlagsUseCase.execute(searchParams);

    return UserFeatureFlagsController.listUserFeatureFlagsToResponse(result);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'UserFeatureFlags not found' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserFeatureFlagsUseCase.execute({ id });

    return UserFeatureFlagsController.userFeatureFlagsToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 404, description: 'UserFeatureFlags not found' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserFeatureFlagsDto: UpdateUserFeatureFlagsDto,
  ) {
    const output = await this.updateUserFeatureFlagsUseCase.execute({
      id,
      ...updateUserFeatureFlagsDto,
    });

    return UserFeatureFlagsController.userFeatureFlagsToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'App user created' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createUserFeatureFlagsDto: CreateUserFeatureFlagsDto) {
    const input: CreateUserFeatureFlagsUsecase.Input = {
      ...createUserFeatureFlagsDto,
    };

    const output = await this.createUserFeatureFlagsUsecase.execute(input);

    return UserFeatureFlagsController.userFeatureFlagsToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'UserFeatureFlags not found' })
  @ApiResponse({ status: 204, description: 'UserFeatureFlags deleted' })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserFeatureFlagsUseCase.execute({ id });
  }
}
