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
  Request,
  UseGuards,
} from '@nestjs/common';
import { UpdateFeatureFlagUsecase } from '@/feature-flag/application/usecases/update-feature-flag.usecase';
import { GetFeatureFlagUsecase } from '@/feature-flag/application/usecases/get-feature-flag.usecase';
import { DeleteFeatureFlagUsecase } from '@/feature-flag/application/usecases/delete-feature-flag.usecase';
import { FeatureFlagOutput } from '@/feature-flag/application/dtos/feature-flag-output';
import {
  FeatureFlagCollectionPresenter,
  FeatureFlagPresenter,
} from '@/feature-flag/infrastructure/presenters/feature-flag.presenter';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';
import { ListFeatureFlagsDto } from '@/feature-flag/infrastructure/dtos/list-feature-flag.dto';
import { CreateFeatureFlagDto } from '@/feature-flag/infrastructure/dtos/create-feature-flag.dto';
import { CreateFeatureFlagUsecase } from '@/feature-flag/application/usecases/create-feature-flag.usecase';
import { UpdateFeatureFlagDto } from '@/feature-flag/infrastructure/dtos/update-feature-flag.dto';
import { ClientFeatureFlagUsecase } from '@/feature-flag//application/usecases/client-feature-flag.usecase';
import { ClientUserGuard } from '@/user/infrastructure/client-user.guard';
import { ClientFeatureFlagsDto } from './dtos/client-feature-flag.dto';
import { ListFeatureFlagsByIdsUsecase } from '@/feature-flag/application/usecases/list-feature-flags-by-ids.usecase';
import { GetFeatureFlagsByIdDto } from '@/feature-flag/infrastructure/dtos/get-feature-flags-by-id.dto';

@ApiTags('feature-flag')
@Controller('feature-flag')
export class FeatureFlagController {
  @Inject(UpdateFeatureFlagUsecase.UseCase)
  private updateFeatureFlagUseCase: UpdateFeatureFlagUsecase.UseCase;

  @Inject(CreateFeatureFlagUsecase.UseCase)
  private createFeatureFlagUseCase: CreateFeatureFlagUsecase.UseCase;

  @Inject(GetFeatureFlagUsecase.UseCase)
  private getFeatureFlagUseCase: GetFeatureFlagUsecase.UseCase;

  @Inject(ListFeatureFlagsUsecase.UseCase)
  private listFeatureFlagsUseCase: ListFeatureFlagsUsecase.UseCase;

  @Inject(ListFeatureFlagsByIdsUsecase.UseCase)
  private listFeatureFlagsByIdsUseCase: ListFeatureFlagsByIdsUsecase.UseCase;

  @Inject(DeleteFeatureFlagUsecase.UseCase)
  private deleteFeatureFlagUseCase: DeleteFeatureFlagUsecase.UseCase;

  @Inject(ClientFeatureFlagUsecase.UseCase)
  private clientFeatureFlagUseCase: ClientFeatureFlagUsecase.UseCase;

  static featureFlagToResponse(
    output: FeatureFlagOutput,
  ): FeatureFlagPresenter {
    return new FeatureFlagPresenter(output);
  }

  static listFeatureFlagToResponse(
    output: ListFeatureFlagsUsecase.Output,
  ): FeatureFlagCollectionPresenter {
    return new FeatureFlagCollectionPresenter(output);
  }

  @ApiOkResponse({
    description: 'The FeatureFlag has been successfully created.',
    type: FeatureFlagCollectionPresenter,
  })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchParams: ListFeatureFlagsDto) {
    const result = await this.listFeatureFlagsUseCase.execute(searchParams);

    return FeatureFlagController.listFeatureFlagToResponse(result);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'FeatureFlags fetched successfully by identifiers.',
    type: FeatureFlagCollectionPresenter,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get('id')
  async findManyById(@Query() query: GetFeatureFlagsByIdDto) {
    const result = await this.listFeatureFlagsByIdsUseCase.execute({
      ids: query.id,
      appUserId: query.appUserId,
    });

    return FeatureFlagController.listFeatureFlagToResponse(result);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'FeatureFlag not found' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getFeatureFlagUseCase.execute({ id });

    return FeatureFlagController.featureFlagToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 404, description: 'FeatureFlag not found' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFeatureFlagDto: UpdateFeatureFlagDto,
  ) {
    const output = await this.updateFeatureFlagUseCase.execute({
      id,
      ...updateFeatureFlagDto,
    });

    return FeatureFlagController.featureFlagToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createFeatureFlagDto: CreateFeatureFlagDto,
    @Request() req,
  ) {
    const input: CreateFeatureFlagUsecase.Input = {
      ...createFeatureFlagDto,
      userId: req.user.id,
    };

    const output = await this.createFeatureFlagUseCase.execute(input);

    return FeatureFlagController.featureFlagToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'FeatureFlag not found' })
  @ApiResponse({ status: 204, description: 'FeatureFlag deleted' })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteFeatureFlagUseCase.execute({ id });
  }

  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'FeatureFlag not found' })
  @UseGuards(ClientUserGuard)
  @Get('client')
  async clientFeatureFlags(@Query() searchParams: ClientFeatureFlagsDto) {
    const output = await this.clientFeatureFlagUseCase.execute(searchParams);

    return FeatureFlagController.featureFlagToResponse(output);
  }
}
