import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ClientFeatureFlagsDto {
  @ApiProperty({
    description: 'The feature flag Name',
    example: 'feature flag 1',
  })
  @IsString()
  featureFlagName: string;

  @ApiPropertyOptional({
    description: 'The app user id for feature flag',
    example: '1953870b-41c0-4f6b-b13d-9a2c4e206d9c',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  appUserId?: string;
}
