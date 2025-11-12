import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { FeatureFlagOutput } from '../dtos/feature-flag-output';
import { ListFeatureFlagsByIdsUsecase } from './list-feature-flags-by-ids.usecase';

export namespace ClientFeatureFlagUsecase {
  export type Input = {
    featureFlagId: string;
    appUserId?: string;
  };

  export type Output = FeatureFlagOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(
      private listFeatureFlagsByIdsUsecase: ListFeatureFlagsByIdsUsecase.UseCase,
    ) {}

    async execute(input: Input): Promise<Output> {
      const result = await this.listFeatureFlagsByIdsUsecase.execute({
        ids: [input.featureFlagId],
        appUserId: input.appUserId,
      });

      return result.items[0];
    }
  }
}
