import { UpdateFeatureFlagUsecase } from '@/feature-flag/application/usecases/update-feature-flag.usecase';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeatureFlagDto
  implements Omit<UpdateFeatureFlagUsecase.Input, 'id'>
{
  @ApiProperty({
    description: 'The name of the feature flag',
    example: 'new-feature-flag',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the feature flag',
    example: 'This flag enables the new user dashboard',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Whether the feature flag is enabled',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;
}
