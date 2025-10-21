import { FeatureFlagInMemoryRepository } from '@/feature-flag/infrastructure/database/in-memory/repositories/feature-flag-in-memory.repository';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { FeatureFlagWithIdNotFoundError } from '@/feature-flag/infrastructure/errors/feature-flag-with-id-not-found-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { UpdateFeatureFlagUsecase } from '@/feature-flag/application/usecases/update-feature-flag.usecase';

describe('Update featureflag use case test', () => {
  let sut: UpdateFeatureFlagUsecase.UseCase;
  let repository: FeatureFlagInMemoryRepository;

  beforeEach(() => {
    repository = new FeatureFlagInMemoryRepository();
    sut = new UpdateFeatureFlagUsecase.UseCase(repository);
  });

  it.todo('should throw featureflagWithIdNotFoundError if featureflag does not exist', async () => {});
});
