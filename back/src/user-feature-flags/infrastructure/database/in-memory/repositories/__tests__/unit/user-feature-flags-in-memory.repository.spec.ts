import { UserFeatureFlagsInMemoryRepository } from '@/user-feature-flags/infrastructure/database/in-memory/repositories/user-feature-flags-in-memory.repository';
import { UserFeatureFlagsDataBuilder } from '@/user-feature-flags/domain/testing/helper/user-feature-flags-data-builder';
import {
  UserFeatureFlagsEntity,
  UserFeatureFlagsProps,
} from '@/user-feature-flags/domain/entities/user-feature-flags.entity';

function createUserFeatureFlagsEntity(
  userFeatureFlagsProps: Partial<UserFeatureFlagsProps> = {},
) {
  return new UserFeatureFlagsEntity(
    UserFeatureFlagsDataBuilder(userFeatureFlagsProps),
  );
}

describe('user-feature-flags in memory repository', () => {
  let sut: UserFeatureFlagsInMemoryRepository;

  beforeEach(() => {
    sut = new UserFeatureFlagsInMemoryRepository();
  });

  it('should insert a user-feature-flag', async () => {
    const entity = createUserFeatureFlagsEntity();
    await sut.insert(entity);

    expect(sut.items).toHaveLength(1);
    expect(sut.items[0]).toEqual(entity);
  });

  it('should find a user-feature-flag by id', async () => {
    const entity = createUserFeatureFlagsEntity();
    await sut.insert(entity);

    const found = await sut.findById(entity.id);

    expect(found).toEqual(entity);
  });

  it('should throw error when user-feature-flag not found', async () => {
    await expect(sut.findById('non-existent-id')).rejects.toThrow();
  });
});
