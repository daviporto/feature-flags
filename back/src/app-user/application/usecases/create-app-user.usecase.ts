import {
  AppUserOutputMapper,
  AppUserOutput,
} from '@/app-user/application/dtos/app-user-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { AbstractUseCase } from '@/shared/application/use-cases/abstract-use-case';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { isUUID } from 'class-validator';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';

export namespace CreateAppUserUsecase {
  export type Input = {
    externalId: string;
    email: string;
    name: string;
  };

  export type Output = AppUserOutput;

  export class UseCase
    extends AbstractUseCase<Input, Output>
    implements UseCaseInterface<Input, Output>
  {
    constructor(private repository: AppUserRepository.Repository) {
      super();
    }

    async execute(input: Input): Promise<Output> {
      this.assureRequiredInputProvided(input);

      if (!isUUID(input.externalId)) {
        throw new InvalidUuidError(input.externalId);
      }

      const AppUser = new AppUserEntity(input);

      const createdAppUser = await this.repository.insert(AppUser);

      return AppUserOutputMapper.toOutput(createdAppUser);
    }

    protected assureRequiredInputProvided(input: Input) {
      const requiredFields = ['externalId', 'name', 'email'];

      super.assureRequiredInputProvided(input, requiredFields);
    }
  }
}
