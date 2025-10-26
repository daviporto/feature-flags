import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import {
  FeatureFlagOutput,
  FeatureFlagOutputMapper,
} from '@/feature-flag/application/dtos/feature-flag-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { AbstractUseCase } from '@/shared/application/use-cases/abstract-use-case';
import { isUUID } from 'class-validator';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';

export namespace UpdateFeatureFlagUsecase {
  export type Input = {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
  };

  export type Output = FeatureFlagOutput;

  export class UseCase
    extends AbstractUseCase<Input, Output>
    implements UseCaseInterface<Input, Output>
  {
    constructor(private repository: FeatureFlagRepository.Repository) {
      super();
    }

    async execute(input: Input): Promise<Output> {
      this.assureRequiredInputProvided(input);

      if (!isUUID(input.id)) {
        throw new InvalidUuidError(input.id);
      }

      await this.repository.assureFeatureFlagExists(input.id);

      const featureFlag = await this.repository.findById(input.id);

      featureFlag.update(input.name, input.description, input.enabled);

      await this.repository.update(featureFlag);

      const updatedFeatureFlag = await this.repository.findById(input.id);

      return FeatureFlagOutputMapper.toOutput(updatedFeatureFlag);
    }

    protected assureRequiredInputProvided(input: Input) {
      const requiredFields = ['id', 'name', 'description', 'enabled'];

      super.assureRequiredInputProvided(input, requiredFields);
    }
  }
}
