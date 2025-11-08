import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';
import { FeatureFlagModelMapper } from '@/feature-flag/infrastructure/database/prisma/models/feature-flag-model.mapper';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { AbstractPrismaRepository } from '@/shared/infrastructure/repository/abstract-prisma.repository';
import { FeatureFlag, Prisma } from '@prisma/client';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

export class FeatureFlagPrismaRepository
  extends AbstractPrismaRepository
  implements FeatureFlagRepository.Repository
{
  sortableFields: string[] = FeatureFlagRepository.sortableFields;

  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async search(
    searchInput: FeatureFlagRepository.SearchParams,
  ): Promise<FeatureFlagRepository.SearchResult> {
    const sortable = this.sortableFields.includes(searchInput.sort) || false;
    const field = sortable
      ? searchInput.sort
      : FeatureFlagRepository.defaultSortField;

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

    return new FeatureFlagRepository.SearchResult({
      items: models.map(FeatureFlagModelMapper.toEntity),
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

  async insert(entity: FeatureFlagEntity): Promise<FeatureFlagEntity> {
    const featureFlag = await this.prismaService.featureFlag.create({
      data: {
        ...entity.toJSON(),
        createdAt: new Date(),
      },
    });

    return FeatureFlagModelMapper.toEntity(featureFlag);
  }

  findById(id: string): Promise<FeatureFlagEntity> {
    return this._get(id);
  }

  async findAll(): Promise<FeatureFlagEntity[]> {
    const models = await this.prismaService.featureFlag.findMany();

    return models.map(FeatureFlagModelMapper.toEntity);
  }

  async update(entity: FeatureFlagEntity): Promise<void> {
    await this.assureFeatureFlagExists(entity.id);

    await this.prismaService.featureFlag.update({
      where: { id: entity.id },
      data: entity.toJSON(),
    });
  }

  async enable(id: string): Promise<void> {
    await this.assureFeatureFlagExists(id);

    await this.prismaService.featureFlag.update({
      where: { id },
      data: {
        enabled: true,
      },
    });
  }

  async disable(id: string): Promise<void> {
    await this.assureFeatureFlagExists(id);

    await this.prismaService.featureFlag.update({
      where: { id },
      data: {
        enabled: false,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.assureFeatureFlagExists(id);

    await this.prismaService.featureFlag.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<FeatureFlagEntity> {
    try {
      const featureFlag = await this.prismaService.featureFlag.findUnique({
        where: { id },
      });

      return FeatureFlagModelMapper.toEntity(featureFlag);
    } catch {
      throw new FeatureFlagWithIdNotFoundError(id);
    }
  }

  private async executeQueries(
    filter: Prisma.FeatureFlagWhereInput,
    searchInput: FeatureFlagRepository.SearchParams,
    field: string,
    orderBy: SortOrderEnum,
  ): Promise<{ count: number; models: FeatureFlag[] }> {
    const [count, models] = await Promise.all([
      this.prismaService.featureFlag.count({ where: filter }),
      this.prismaService.featureFlag.findMany({
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
    searchInput: FeatureFlagRepository.SearchParams,
  ): Prisma.FeatureFlagWhereInput {
    const filtersObject: Prisma.FeatureFlagWhereInput = {};

    if (!isUndefined(searchInput.filter?.enabled)) {
      const enabledBool =
        typeof searchInput.filter.enabled === 'string'
          ? searchInput.filter.enabled !== '0'
          : Boolean(searchInput.filter.enabled);

      filtersObject['enabled'] = {
        equals: enabledBool,
      };
    }

    if (searchInput.filter?.name) {
      filtersObject['name'] = {
        contains: searchInput.filter.name,
        mode: 'insensitive',
      };
    }

    if (searchInput.filter?.description) {
      filtersObject['description'] = {
        contains: searchInput.filter.description,
        mode: 'insensitive',
      };
    }

    return filtersObject;
  }

  public async assureFeatureFlagExists(id: string): Promise<void> {
    if ((await this.prismaService.featureFlag.count({ where: { id } })) === 0) {
      throw new FeatureFlagWithIdNotFoundError(id);
    }
  }
}
