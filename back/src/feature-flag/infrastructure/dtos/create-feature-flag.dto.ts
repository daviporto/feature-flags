import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateFeatureFlagUsecase } from '@/feature-flag/application/usecases/create-feature-flag.usecase';

export class CreateFeatureFlagDto
  implements Omit<CreateFeatureFlagUsecase.Input, 'userId'>
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
