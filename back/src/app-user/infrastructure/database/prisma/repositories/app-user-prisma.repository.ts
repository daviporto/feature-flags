import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { AppUserWithIdNotFoundError } from '@/app-user/infrastructure/errors/app-user-with-id-not-found-error';
import { AppUserModelMapper } from '@/app-user/infrastructure/database/prisma/models/app-user-model.mapper';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';
import { AppUser, Prisma } from '@prisma/client';
import { AbstractPrismaRepository } from '@/shared/infrastructure/repository/abstract-prisma.repository';

export class AppUserPrismaRepository
  extends AbstractPrismaRepository
  implements AppUserRepository.Repository
{
  sortableFields = AppUserRepository.sortableFields;

  constructor(protected prismaService: PrismaService) {
    super(prismaService);
  }

  async search(
    searchInput: AppUserRepository.SearchParams,
  ): Promise<AppUserRepository.SearchResult> {
    const sortable = this.sortableFields.includes(searchInput.sort) || false;
    const field = sortable
      ? searchInput.sort
      : AppUserRepository.defaultSortField;

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

    return new AppUserRepository.SearchResult({
      items: models.map(AppUserModelMapper.toEntity),
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

  private async executeQueries(
    filter: Prisma.AppUserWhereInput,
    searchInput: AppUserRepository.SearchParams,
    field: string,
    orderBy: SortOrderEnum,
  ): Promise<{ count: number; models: AppUser[] }> {
    const [count, models] = await Promise.all([
      this.prismaService.appUser.count({ where: filter }),
      this.prismaService.appUser.findMany({
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

  async insert(entity: AppUserEntity): Promise<AppUserEntity> {
    const appUser = await this.prismaService.appUser.create({
      data: entity.toJSON(),
    });

    return AppUserModelMapper.toEntity(appUser);
  }

  findById(id: string): Promise<AppUserEntity> {
    return this._get(id);
  }

  async findAll(): Promise<AppUserEntity[]> {
    const models = await this.prismaService.appUser.findMany();

    return models.map(AppUserModelMapper.toEntity);
  }

  async update(entity: AppUserEntity): Promise<void> {
    await this._assureAppUserExists(entity.id);

    await this.prismaService.appUser.update({
      where: { id: entity.id },
      data: entity.toJSON(),
    });
  }

  async delete(id: string): Promise<void> {
    await this._assureAppUserExists(id);

    await this.prismaService.appUser.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<AppUserEntity> {
    try {
      const appUser = await this.prismaService.appUser.findUnique({
        where: { id },
      });

      return AppUserModelMapper.toEntity(appUser);
    } catch {
      throw new AppUserWithIdNotFoundError(id);
    }
  }

  private async _assureAppUserExists(id: string) {
    if ((await this.prismaService.appUser.count({ where: { id } })) === 0) {
      throw new AppUserWithIdNotFoundError(id);
    }
  }

  private mountFilterObjects(
    searchInput: AppUserRepository.SearchParams,
  ): Prisma.AppUserWhereInput {
    const filtersObject: Prisma.AppUserWhereInput = {};

    if (searchInput.filter?.externalId) {
      filtersObject['externalId'] = {
        contains: searchInput.filter.externalId,
        mode: 'insensitive',
      };
    }

    if (searchInput.filter?.name) {
      filtersObject['name'] = {
        contains: searchInput.filter.name,
        mode: 'insensitive',
      };
    }

    if (searchInput.filter?.email) {
      filtersObject['email'] = {
        contains: searchInput.filter.email,
        mode: 'insensitive',
      };
    }
    return filtersObject;
  }
}
