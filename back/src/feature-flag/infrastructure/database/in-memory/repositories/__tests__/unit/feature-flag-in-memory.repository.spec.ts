import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';

describe('featureFlag in memory repository', () => {
  let sut: FeatureFlagInMemoryRepository;

  beforeEach(() => {
    sut = new FeatureFlagInMemoryRepository();
  });

  describe('apply filters method', () => {});

  describe('apply sort method', () => {});
});
