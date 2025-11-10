import { UpdateUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/update-user-feature-flags.usecase';
import { IsNotEmpty, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserFeatureFlagsDto
  implements Omit<UpdateUserFeatureFlagsUsecase.Input, 'id'>
{
  @ApiProperty({
    description: 'The id of the user',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The id of the feature flag',
  })
  @IsUUID()
  @IsNotEmpty()
  featureFlagId: string;

  @ApiProperty({
    description: 'Whether the user feature flag is enabled',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;
}
