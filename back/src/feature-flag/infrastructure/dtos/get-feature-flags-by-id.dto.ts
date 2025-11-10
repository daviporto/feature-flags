import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

const normalizeToArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => `${entry}`.split(','))
      .map((entry) => entry.trim())
      .filter((entry) => entry.length);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length);
  }

  if (typeof value === 'number') {
    return [`${value}`];
  }

  return [];
};

export class GetFeatureFlagsByIdDto {
  @ApiProperty({
    name: 'id',
    type: [String],
    description:
      'Feature flag identifiers to be retrieved. Accepts comma-separated or repeated query params.',
    example: ['8cf10340-8c08-4f2d-8c88-ef1d8f8536da'],
    isArray: true,
  })
  @Transform(({ value }) => normalizeToArray(value))
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  id: string[];

  @ApiPropertyOptional({
    description:
      'Optional AppUser identifier to filter feature flags that target the informed user.',
    example: '5f2c3de7-0fc9-475c-a6b4-d9067bda3d89',
  })
  @IsOptional()
  @IsUUID('4')
  appUserId?: string;
}

