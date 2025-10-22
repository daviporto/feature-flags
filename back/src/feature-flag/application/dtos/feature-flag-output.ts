import {FeatureFlagEntity} from '@/feature-flag/domain/entities/feature-flag.entity';

export type FeatureFlagOutput = {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class FeatureFlagOutputMapper {
    static toOutput(entity: FeatureFlagEntity): FeatureFlagOutput {
        return entity.toJSON();
    }
}
