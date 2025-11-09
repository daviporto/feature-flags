import { UserFeatureFlagsOutput } from '@/user-feature-flags/application/dtos/user-feature-flags-output';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ListUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/list-user-feature-flags.usecase';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

export class UserFeatureFlagsPresenter {
  @ApiProperty({ description: 'The id of the user feature flag' })
  id: string;

  @ApiProperty({ description: 'The id of the feature flag' })
  featureFlagId: string;

  @ApiProperty({ description: 'The id of the user' })
  userId: string;

  @ApiProperty({
    description: 'The status of the user feature flag, if is active or not',
  })
  enabled: boolean;

  constructor(output: UserFeatureFlagsOutput) {
    this.id = output.id;
    this.enabled = output.enabled;
    this.userId = output.userId;
    this.featureFlagId = output.featureFlagId;
  }
}

@ApiExtraModels(UserFeatureFlagsPresenter)
export class UserFeatureFlagsCollectionPresenter extends CollectionPresenter {
  @ApiProperty({
    type: UserFeatureFlagsPresenter,
    isArray: true,
    description: 'List of UserFeatureFlags',
  })
  data: UserFeatureFlagsPresenter[];

  constructor(output: ListUserFeatureFlagsUsecase.Output) {
    const { items, ...pagination } = output;
    super(pagination);
    this.data = items.map((item) => new UserFeatureFlagsPresenter(item));
  }
}
