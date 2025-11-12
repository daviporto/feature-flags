import { FeatureFlagOutput } from '@/feature-flag/application/dtos/feature-flag-output';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ApiExtraModels, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';
import { UserFeatureFlagsOutput } from '@/user-feature-flags/application/dtos/user-feature-flags-output';

class FeatureFlagTargetUserPresenter {
  @ApiProperty({ description: 'The id of the user feature flag' })
  id: string;

  @ApiProperty({ description: 'The related feature flag id' })
  featureFlagId: string;

  @ApiProperty({ description: 'The related app user id' })
  userId: string;

  @ApiProperty({
    description:
      'Whether the feature flag is enabled for the specified app user',
  })
  enabled: boolean;

  constructor(output: UserFeatureFlagsOutput) {
    this.id = output.id;
    this.featureFlagId = output.featureFlagId;
    this.userId = output.userId;
    this.enabled = output.enabled;
  }
}

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

  @ApiPropertyOptional({
    description:
      'Target user information when feature flags are filtered by AppUser',
    type: () => FeatureFlagTargetUserPresenter,
  })
  targetUser?: FeatureFlagTargetUserPresenter;

  constructor(
    output: FeatureFlagOutput & { targetUser?: UserFeatureFlagsOutput },
  ) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.enabled = output.enabled;
    this.createdAt = output.createdAt;
    this.updatedAt = output.updatedAt;
    if (output.targetUser) {
      this.targetUser = new FeatureFlagTargetUserPresenter(output.targetUser);
    }
  }
}

@ApiExtraModels(FeatureFlagPresenter, FeatureFlagTargetUserPresenter)
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
