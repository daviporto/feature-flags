import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import {
  FeatureFlagOutput,
  FeatureFlagOutputMapper,
} from '../dtos/feature-flag-output';

export namespace ClientFeatureFlagUsecase {
  export type Input = {
    featureFlagId: string;
    appUserId?: string;
  };

  export type Output = FeatureFlagOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: FeatureFlagRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.repository.findById(input.featureFlagId);

      return FeatureFlagOutputMapper.toOutput(entity);
    }
  }
}
