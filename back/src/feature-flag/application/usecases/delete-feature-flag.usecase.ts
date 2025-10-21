import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export namespace DeleteFeatureFlagUsecase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: FeatureFlagRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.repository.delete(input.id);
    }
  }
}
