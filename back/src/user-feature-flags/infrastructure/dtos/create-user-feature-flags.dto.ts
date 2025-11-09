import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/create-user-feature-flags.usecase';
import { IsUUID } from 'class-validator';

export class CreateUserFeatureFlagsDto
  implements CreateUserFeatureFlagsUsecase.Input
{
  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  featureFlagId: string;
}
