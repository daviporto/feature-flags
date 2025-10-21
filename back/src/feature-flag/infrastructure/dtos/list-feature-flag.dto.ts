import { UpdateFeatureFlagUsecase } from '@/feature-flag/application/usecases/update-feature-flag.usecase';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class ListFeatureFlagsDto implements ListFeatureFlagUsecase.Input {
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
  filter?: string | null;
}
