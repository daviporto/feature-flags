import {FeatureFlagProps} from "@/feature-flag/domain/entities/feature-flag.entity";
import {PrismaClient,} from '@prisma/client';
import {FeatureFlagDataBuilder} from "@/feature-flag/domain/testing/helper/feature-flag-data-builder";
import {FeatureFlagModelMapper} from "@/feature-flag/infrastructure/database/prisma/models/feature-flag-model.mapper";

f

export class FeatureFlagPrismaTestingHelper {
    static async createFeatureFlag(
        prisma: PrismaClient,
        props: Partial<FeatureFlagProps>
    ) {
        return prisma.featureFlag.create({
            data: FeatureFlagDataBuilder(props)
        });
    }

    static async createFeatureFlagAsEntity(
        prisma: PrismaClient,
        props: Partial<FeatureFlagProps>
    ) {
        const featureFlag = await this.createFeatureFlag(props);

        return FeatureFlagModelMapper.toEntity(featureFlag);
    }
}