import { faker } from '@faker-js/faker';
import { FeatureFlagProps } from '@/feature-flag/domain/entities/feature-flag.entity';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

export function FeatureFlagDataBuilder(props: Partial<FeatureFlagProps>) {
  if (isUndefined(props.enabled)) {
    props.enabled = faker.datatype.boolean();
  }

  return {
    name: props.name || faker.string.alphanumeric(),
    description: props.description || faker.string.alphanumeric(),
    enabled: props.enabled,
    userId: props.userId || faker.string.uuid(),
    createdAt: props.createdAt || new Date(),
    updatedAt: props.updatedAt || new Date(),
  };
}
