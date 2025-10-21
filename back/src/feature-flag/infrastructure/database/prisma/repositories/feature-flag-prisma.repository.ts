import { Prisma } from '@prisma/client';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';
import { FeatureFlagModelMapper } from '@/feature-flag/infrastructure/database/prisma/models/feature-flag-model.mapper';
import { SortOrderEnum } from '@/shared/domain/repositories/searchable-repository-contracts';

export class FeatureFlagPrismaRepository implements FeatureFlagRepository.Repository {
  constructor(private prismaService: PrismaService) {}

  async insert(entity: FeatureFlagEntity): Promise<void> {
    const featureflag = await this.prismaService.feature-flag.create({
      data: entity.toJSON(),
    });

    return FeatureFlagModelMapper.toEntity(featureflag);
  }

  findById(id: string): Promise<FeatureFlagEntity> {
    return this._get(id);
  }

  async findAll(): Promise<FeatureFlagEntity[]> {
    const models = await this.prismaService.feature-flag.findMany();

    return models.map(FeatureFlagModelMapper.toEntity);
  }

  async update(entity: FeatureFlagEntity): Promise<void> {
    await this._assureFeatureFlagExists(entity.id);

    await this.prismaService.feature-flag.update({
      where: { id: entity.id },
      data: entity.toJSON(),
    });
  }

  async delete(id: string): Promise<void> {
    await this._assureFeatureFlagExists(id);

    await this.prismaService.feature-flag.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<FeatureFlagEntity> {
    try {
      const feature-flag = await this.prismaService.feature-flag.findUnique({
        where: { id },
      });

      return FeatureFlagModelMapper.toEntity(feature-flag);
    } catch {
      throw new FeatureFlagWithIdNotFoundError(id);
    }
  }

  private async _assureFeatureFlagExists(id: string) {
    if ((await this.prismaService.feature-flag.count({ where: { id } })) === 0) {
      throw new FeatureFlagWithIdNotFoundError(id);
    }
  }
}
