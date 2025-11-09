import { faker } from '@faker-js/faker';
import { UserFeatureFlagsProps } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';

export function UserFeatureFlagsDataBuilder(
  props: Partial<UserFeatureFlagsProps> = {},
): UserFeatureFlagsProps {
  return {
    featureFlagId: props.featureFlagId || faker.string.uuid(),
    userId: props.userId || faker.string.uuid(),
    enabled: props.enabled !== undefined ? props.enabled : true,
  };
}
