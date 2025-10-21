import { FeatureFlagOutput } from '@/feature-flag/application/dtos/feature-flag-output';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flags.usecase';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

export class FeatureFlagPresenter {
  constructor(output: FeatureFlagOutput) { }
}

@ApiExtraModels(FeatureFlagPresenter)
export class FeatureFlagCollectionPresenter extends CollectionPresenter {
  @ApiProperty({
    type: FeatureFlagPresenter,
    isArray: true,
    description: 'List of FeatureFlag',
  })
  data: FeatureFlagPresenter[];

  constructor(output: ListFeatureFlagsUsecase.Output) {
    const { items, ...pagination } = output;
    super(pagination);
    this.data = items.map((item) => new FeatureFlagPresenter(item));
  }
}
