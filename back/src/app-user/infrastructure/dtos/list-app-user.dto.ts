import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';

export class ListAppUsersDto implements ListAppUserUsecase.Input {
  @ApiPropertyOptional({ description: 'The page number' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'The number of items per page' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'The field that should be used for sorting',
    enum: ['name', 'createdAt'],
  })
  @IsOptional()
  sort?: string | null;

  @ApiPropertyOptional({
    description: 'The sort direction',
    enum: SortOrderEnum,
  })
  @IsOptional()
  @IsIn([SortOrderEnum.ASC, SortOrderEnum.DESC])
  sortDir?: SortOrderEnum | null;

  @ApiPropertyOptional({
    description: 'The filter to apply to the search',
    enum: ['name'],
  })
  @ApiPropertyOptional({
    description: 'The filter to apply to the search',
    example: {
      name: 'feature',
      description: 'user feature',
      enabled: true,
    },
  })
  @IsOptional()
  filter?: {
    name?: string;
    email?: string;
    externalId?: string;
  } | null;
}
