import { UserFeatureFlagsRepository } from '@/user-feature-flags/domain/repositories/user-feature-flags.repository';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export namespace DeleteUserFeatureFlagsUsecase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: UserFeatureFlagsRepository.Repository) {}

    async execute(input: Input): Promise<void> {
      const entity = await this.repository.findById(input.id);

      await this.repository.delete(entity.id);
    }
  }
}
