import { faker } from '@faker-js/faker';
import { AppUserProps } from '@/app-user/domain/entities/app-user.entity';

export function AppUserDataBuilder(props: Partial<AppUserProps>) {
  return {
    name: props.name || faker.person.fullName(),
    email: props.email || faker.internet.email(),
    externalId: props.externalId || faker.string.uuid(),
    createdAt: props.createdAt || new Date(),
  };
}
