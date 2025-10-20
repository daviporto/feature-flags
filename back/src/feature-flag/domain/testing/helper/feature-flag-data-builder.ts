import { faker } from '@faker-js/faker';
import { FeatureFlagProps } from '@/feature-flag/domain/entities/feature-flag.entity';

export function FeatureFlagDataBuilder(props: Partial<FeatureFlagProps>) {
  return {
    name: props.name || faker.string.alphanumeric(),
    description: props.description || faker.string.alphanumeric(),
    enabled: props.enabled || faker.datatype.boolean(),
    userId: props.userId || faker.string.uuid(),
    createdAt: props.createdAt || new Date(),
  };
}
