import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import {
  FeatureFlagOutput,
  FeatureFlagOutputMapper,
} from '@/feature-flag/application/dtos/feature-flag-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { AbstractUseCase } from '@/shared/application/use-cases/abstract-use-case';
import { UserRepository } from '@/user/domain/repositories/user.repository';
import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { isUUID } from 'class-validator';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';

export namespace CreateFeatureFlagUsecase {
  export type Input = {
    name: string;
    description: string;
    enabled: boolean;
    userId: string;
  };

  export type Output = FeatureFlagOutput;

  export class UseCase
    extends AbstractUseCase<Input, Output>
    implements UseCaseInterface<Input, Output>
  {
    constructor(
      private repository: FeatureFlagRepository.Repository,
      private userRepository: UserRepository.Repository,
    ) {
      super();
    }

    async execute(input: Input): Promise<Output> {
      this.assureRequiredInputProvided(input);

      if (!isUUID(input.userId)) {
        throw new InvalidUuidError(input.userId);
      }

      await this.userRepository.assureUserExists(input.userId);

      const featureFlag = new FeatureFlagEntity(input);

      const createdFeatureFlag = await this.repository.insert(featureFlag);

      return FeatureFlagOutputMapper.toOutput(createdFeatureFlag);
    }

    protected assureRequiredInputProvided(input: Input) {
      const requiredFields = ['userId', 'name', 'description', 'enabled'];

      super.assureRequiredInputProvided(input, requiredFields);
    }
  }
}
