import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import {
  UserFeatureFlagsOutput,
  UserFeatureFlagsOutputMapper,
} from '@/user-feature-flags/application/dtos/user-feature-flags-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { AbstractUseCase } from '@/shared/application/use-cases/abstract-use-case';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { UserFeatureFlagsEntity } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';
import { isUUID } from 'class-validator';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { UserFeatureFlagAlreadyExistsError } from '@/user-feature-flags/infrastructure/errors/user-feature-flag-already-exists-error';

export namespace CreateUserFeatureFlagsUsecase {
  export type Input = {
    featureFlagId: string;
    userId: string;
    enabled: boolean;
  };

  export type Output = UserFeatureFlagsOutput;

  export class UseCase
    extends AbstractUseCase<Input, Output>
    implements UseCaseInterface<Input, Output>
  {
    constructor(
      private repository: UserFeatureFlagsRepository.Repository,
      private featureFlagRepository: FeatureFlagRepository.Repository,
      private userRepository: AppUserRepository.Repository,
    ) {
      super();
    }

    async execute(input: Input): Promise<Output> {
      this.assureRequiredInputProvided(input);

      if (!isUUID(input.userId)) {
        throw new InvalidUuidError(input.userId);
      }

      if (!isUUID(input.featureFlagId)) {
        throw new InvalidUuidError(input.featureFlagId);
      }

      await this.featureFlagRepository.assureFeatureFlagExists(
        input.featureFlagId,
      );

      await this.userRepository.assureAppUserExists(input.userId);

      // Check if user-feature-flag already exists
      const searchParams = new UserFeatureFlagsRepository.SearchParams({
        page: 1,
        perPage: 1,
        filter: {
          featureFlagId: input.featureFlagId,
          userId: input.userId,
        },
      });
      const searchResult = await this.repository.search(searchParams);

      if (searchResult.items.length > 0) {
        throw new UserFeatureFlagAlreadyExistsError(
          input.featureFlagId,
          input.userId,
        );
      }

      const userFeatureFlag = new UserFeatureFlagsEntity(input);

      const createduserFeatureFlag =
        await this.repository.insert(userFeatureFlag);

      return UserFeatureFlagsOutputMapper.toOutput(createduserFeatureFlag);
    }

    protected assureRequiredInputProvided(input: Input) {
      const requiredFields = ['featureFlagId', 'userId', 'enabled'];

      super.assureRequiredInputProvided(input, requiredFields);
    }
  }
}
