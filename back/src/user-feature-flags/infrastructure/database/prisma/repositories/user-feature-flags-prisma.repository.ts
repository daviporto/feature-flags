import { Prisma, UserFeatureFlag } from '@prisma/client';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserFeatureFlagsWithIdNotFoundError } from '@/user-feature-flags/infrastructure/errors/user-feature-flags-with-id-not-found-error';
import { UserFeatureFlagsModelMapper } from '@/user-feature-flags/infrastructure/database/prisma/models/user-feature-flags-model.mapper';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { AbstractPrismaRepository } from '@/shared/infrastructure/repository/abstract-prisma.repository';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

export class UserFeatureFlagsPrismaRepository
  extends AbstractPrismaRepository
  implements UserFeatureFlagsRepository.Repository
{
  sortableFields: string[] = UserFeatureFlagsRepository.sortableFields;

  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async search(
    searchInput: UserFeatureFlagsRepository.SearchParams,
  ): Promise<UserFeatureFlagsRepository.SearchResult> {
    const sortable = this.sortableFields.includes(searchInput.sort) || false;
    const field = sortable
      ? searchInput.sort
      : UserFeatureFlagsRepository.defaultSortField;

    const orderBy =
      sortable && searchInput.sortDir
        ? searchInput.sortDir
        : SortOrderEnum.DESC;

    const filtersObject = this.mountFilterObjects(searchInput);

    const { count, models } = await this.executeQueries(
      filtersObject,
      searchInput,
      field,
      orderBy,
    );

    return new UserFeatureFlagsRepository.SearchResult({
      items: models.map(UserFeatureFlagsModelMapper.toEntity),
      total: count,
      currentPage:
        searchInput.page && searchInput.page > 0 ? searchInput.page : 1,
      perPage:
        searchInput.perPage && searchInput.perPage > 0
          ? searchInput.perPage
          : 10,
      sort: field,
      sortDir: orderBy,
      filter: searchInput.filter,
    });
  }

  async insert(
    entity: UserFeatureFlagsEntity,
  ): Promise<UserFeatureFlagsEntity> {
    const featureFlag = await this.prismaService.userFeatureFlag.create({
      data: {
        ...entity.toJSON(),
      },
    });

    return UserFeatureFlagsModelMapper.toEntity(featureFlag);
  }

  findById(id: string): Promise<UserFeatureFlagsEntity> {
    return this._get(id);
  }

  async findAll(): Promise<UserFeatureFlagsEntity[]> {
    const models = await this.prismaService.userFeatureFlag.findMany();

    return models.map(UserFeatureFlagsModelMapper.toEntity);
  }

  async update(entity: UserFeatureFlagsEntity): Promise<void> {
    await this.assureUserFeatureFlagExists(entity.id);

    await this.prismaService.userFeatureFlag.update({
      where: { id: entity.id },
      data: entity.toJSON(),
    });
  }

  async enable(id: string): Promise<void> {
    await this.assureUserFeatureFlagExists(id);

    await this.prismaService.userFeatureFlag.update({
      where: { id },
      data: {
        enabled: true,
      },
    });
  }

  async disable(id: string): Promise<void> {
    await this.assureUserFeatureFlagExists(id);

    await this.prismaService.userFeatureFlag.update({
      where: { id },
      data: {
        enabled: false,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.assureUserFeatureFlagExists(id);

    await this.prismaService.userFeatureFlag.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<UserFeatureFlagsEntity> {
    try {
      const featureFlag = await this.prismaService.userFeatureFlag.findUnique({
        where: { id },
      });

      return UserFeatureFlagsModelMapper.toEntity(featureFlag);
    } catch {
      throw new UserFeatureFlagsWithIdNotFoundError(id);
    }
  }

  private async executeQueries(
    filter: Prisma.UserFeatureFlagWhereInput,
    searchInput: UserFeatureFlagsRepository.SearchParams,
    field: string,
    orderBy: SortOrderEnum,
  ): Promise<{ count: number; models: UserFeatureFlag[] }> {
    const [count, models] = await Promise.all([
      this.prismaService.userFeatureFlag.count({ where: filter }),
      this.prismaService.userFeatureFlag.findMany({
        where: filter,
        orderBy: {
          [field]: orderBy,
        },
        skip: this.getSkip(searchInput),
        take: this.getTake(searchInput),
      }),
    ]);

    return {
      count,
      models,
    };
  }

  private mountFilterObjects(
    searchInput: UserFeatureFlagsRepository.SearchParams,
  ): Prisma.UserFeatureFlagWhereInput {
    const filtersObject: Prisma.UserFeatureFlagWhereInput = {};

    if (!isUndefined(searchInput.filter?.enabled)) {
      filtersObject['enabled'] = {
        equals: !!searchInput.filter.enabled,
      };
    }

    return filtersObject;
  }

  public async assureUserFeatureFlagExists(id: string): Promise<void> {
    if (
      (await this.prismaService.userFeatureFlag.count({ where: { id } })) === 0
    ) {
      throw new UserFeatureFlagsWithIdNotFoundError(id);
    }
  }
}
