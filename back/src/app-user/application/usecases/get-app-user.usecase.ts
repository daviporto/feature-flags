import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import {
  AppUserOutput,
  AppUserOutputMapper,
} from '@/app-user/application/dtos/app-user-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';

export namespace GetAppUserUsecase {
  export type Input = {
    id: string;
  };

  export type Output = AppUserOutput;

  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(private repository: AppUserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.repository.findById(input.id);

      return AppUserOutputMapper.toOutput(entity);
    }
  }
}
