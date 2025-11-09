import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import {
  UserFeatureFlagsOutput,
  UserFeatureFlagsOutputMapper,
} from '@/user-feature-flags/application/dtos/user-feature-flags-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export namespace GetUserFeatureFlagsUsecase {
  export type Input = {
    id: string;
  };

  export type Output = UserFeatureFlagsOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: UserFeatureFlagsRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.repository.findById(input.id);

      return UserFeatureFlagsOutputMapper.toOutput(entity);
    }
  }
}
