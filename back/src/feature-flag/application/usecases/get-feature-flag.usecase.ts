import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import {
  FeatureFlagOutput,
  FeatureFlagOutputMapper,
} from '@/feature-flag/application/dtos/feature-flag-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export namespace GetFeatureFlagUsecase {
  export type Input = {
    id: string;
  };

  export type Output = FeatureFlagOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: FeatureFlagRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.repository.findById(input.id);

      return FeatureFlagOutputMapper.toOutput(entity);
    }
  }
}
