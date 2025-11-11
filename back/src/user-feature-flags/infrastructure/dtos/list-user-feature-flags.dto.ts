import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { IsIn, IsOptional } from 'class-validator';
import { ListUserFeatureFlagsUsecase } from '@/user-feature-flags/application/usecases/list-user-feature-flags.usecase';

export class ListUserFeatureFlagsDto
  implements ListUserFeatureFlagsUsecase.Input
{
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
  @IsOptional()
  filter?: {
    featureFlagId?: string;
    userId?: string;
    enabled?: boolean;
  } | null;
}
