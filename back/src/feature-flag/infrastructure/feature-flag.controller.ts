import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateFeatureFlagUsecase } from '@/feature-flag/application/usecases/update-feature-flag.usecase';
import { GetFeatureFlagUsecase } from '@/feature-flag/application/usecases/get-feature-flag.usecase';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flags.usecase';
import { DeleteFeatureFlagUsecase } from '@/feature-flag/application/usecases/delete-feature-flag.usecase';
import { ListFeatureFlagsDto } from '@/feature-flag/infrastructure/dtos/list-feature-flags.dto';
import { UpdateFeatureFlagDto } from '@/feature-flag/infrastructure/dtos/update-feature-flag.dto';
import { FeatureFlagOutput } from '@/feature-flag/application/dtos/feature-flag-output';
import {
  FeatureFlagCollectionPresenter,
  FeatureFlagPresenter,
} from '@/feature-flag/infrastructure/presenters/feature-flag.presenter';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('feature-flag')
@Controller('feature-flag')
export class FeatureFlagController {
  @Inject(UpdateFeatureFlagUsecase.UseCase)
  private updateFeatureFlagUseCase: UpdateFeatureFlagUsecase.UseCase;

  @Inject(GetFeatureFlagUsecase.UseCase)
  private getFeatureFlagUseCase: GetFeatureFlagUsecase.UseCase;

  @Inject(ListFeatureFlagsUsecase.UseCase)
  private listFeatureFlagsUseCase: ListFeatureFlagsUsecase.UseCase;

  @Inject(DeleteFeatureFlagUsecase.UseCase)
  private deleteFeatureFlagUseCase: DeleteFeatureFlagUsecase.UseCase;

  @Inject(AuthService)
  private authService: AuthService;

  static featureFlagToResponse(output: FeatureFlagOutput): FeatureFlagPresenter {
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
  async update(@Param('id') id: string, @Body() updateFeatureFlagDto: UpdateFeatureFlagDto) {
    const output = await this.updateFeatureFlagUseCase.execute({
      id,
      ...updateFeatureFlagDto,
    });

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
}
