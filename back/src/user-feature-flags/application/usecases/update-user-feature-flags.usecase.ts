import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import {
  UserFeatureFlagsOutput,
  UserFeatureFlagsOutputMapper,
} from '@/user-feature-flags/application/dtos/user-feature-flags-output';
import { AbstractUseCase } from '@/shared/application/use-cases/abstract-use-case';
import { isUUID } from 'class-validator';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export namespace UpdateUserFeatureFlagsUsecase {
  export type Input = {
    id: string;
    userId: string;
    featureFlagId: string;
    enabled: boolean;
  };

  export type Output = UserFeatureFlagsOutput;

  export class UseCase
    extends AbstractUseCase<Input, Output>
    implements UseCaseInterface<Input, Output>
  {
    constructor(private repository: UserFeatureFlagsRepository.Repository) {
      super();
    }

    async execute(input: Input): Promise<Output> {
      this.assureRequiredInputProvided(input);

      if (!isUUID(input.id)) {
        throw new InvalidUuidError(input.id);
      }

      if (!isUUID(input.userId)) {
        throw new InvalidUuidError(input.userId);
      }

      if (!isUUID(input.featureFlagId)) {
        throw new InvalidUuidError(input.featureFlagId);
      }

      await this.repository.assureUserFeatureFlagExists(input.id);

      const userFeatureFlag = await this.repository.findById(input.id);

      userFeatureFlag.update(input.userId, input.featureFlagId, input.enabled);

      await this.repository.update(userFeatureFlag);

      const updatedUserFeatureFlag = await this.repository.findById(input.id);

      return UserFeatureFlagsOutputMapper.toOutput(updatedUserFeatureFlag);
    }

    protected assureRequiredInputProvided(input: Input) {
      const requiredFields = ['userId', 'featureFlagId', 'enabled', 'id'];

      super.assureRequiredInputProvided(input, requiredFields);
    }
  }
}
