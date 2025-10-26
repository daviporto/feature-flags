import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListFeatureFlagsUsecase } from '@/feature-flag/application/usecases/list-feature-flag.usecase';

export class ListFeatureFlagsDto implements ListFeatureFlagsUsecase.Input {
  @ApiPropertyOptional({
    description: 'The page number',
    example: 1,
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'The number of items per page',
    example: 10,
  })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'The field that should be used for sorting',
    enum: ['name', 'createdAt'],
    example: 'name',
  })
  @IsOptional()
  sort?: string | null;

  @ApiPropertyOptional({
    description: 'The sort direction',
    enum: SortOrderEnum,
    example: SortOrderEnum.ASC,
  })
  @IsOptional()
  @IsIn([SortOrderEnum.ASC, SortOrderEnum.DESC])
  sortDir?: SortOrderEnum | null;

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
    description?: string;
    enabled?: boolean;
  } | null;
}
