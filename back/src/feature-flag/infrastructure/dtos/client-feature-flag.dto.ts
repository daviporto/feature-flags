import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ClientFeatureFlagsDto {
  @ApiProperty({
    description: 'The feature flag admin api token',
    example: '79fcd962-d523-4531-8b74-2854f579e062',
  })
  @IsString()
  @IsUUID()
  token: string;

  @ApiProperty({
    description: 'The feature flag ID',
    example: '9de0d313-2302-48e6-b775-6e93922ad38a',
  })
  @IsString()
  @IsUUID()
  featureFlagId: string;

  @ApiPropertyOptional({
    description: 'The app user id for feature flag',
    example: '1953870b-41c0-4f6b-b13d-9a2c4e206d9c',
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  appUserId?: string;
}
