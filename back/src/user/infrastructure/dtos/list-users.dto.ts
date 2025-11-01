import { ListUsersUsecase } from '@/user/application/usecases/list-users.usecase';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListUsersDto implements ListUsersUsecase.Input {
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
  // @IsIn([SortOrderEnum.ASC, SortOrderEnum.DESC])
  sortDir?: SortOrderEnum | null;

  @ApiPropertyOptional({
    description: 'The filter to apply to the search',
    enum: ['name', 'email'],
  })
  @IsOptional()
  filter?: string | null;
}
