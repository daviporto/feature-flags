import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export namespace DeleteAppUserUsecase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: AppUserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.repository.delete(input.id);
    }
  }
}
