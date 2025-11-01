import { FeatureFlagOutput } from '@/feature-flag/application/dtos/feature-flag-output';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';

export class FeatureFlagPresenter {
  @ApiProperty({ description: 'The id of the feature flag' })
  id: string;

  @ApiProperty({ description: 'The name of the feature flag' })
  name: string;

  @ApiProperty({ description: 'The description of the feature flag' })
  description: string;

  @ApiProperty({
    description: 'The status of the feature flag, if is active or not',
  })
  enabled: boolean;

  @ApiProperty({ description: 'The date when the feature flag was created' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({
    nullable: true,
    description: 'The data of last feature flag update',
  })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date;

  constructor(output: FeatureFlagOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.enabled = output.enabled;
    this.createdAt = output.createdAt;
    this.updatedAt = output.updatedAt;
  }
}

@ApiExtraModels(FeatureFlagPresenter)
export class FeatureFlagCollectionPresenter extends CollectionPresenter {
  @ApiProperty({
    type: FeatureFlagPresenter,
    isArray: true,
    description: 'List of FeatureFlags',
  })
  data: FeatureFlagPresenter[];

  constructor(output: ListFeatureFlagsUsecase.Output) {
    const { items, ...pagination } = output;
    super(pagination);
    this.data = items.map(
      (item: FeatureFlagOutput) => new FeatureFlagPresenter(item),
    );
  }
}
