import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import {
  AppUserOutput,
  AppUserOutputMapper,
} from '@/app-user/application/dtos/app-user-output';
import { UseCaseInterface } from '@/shared/application/use-cases/use-case';
import { AbstractUseCase } from '@/shared/application/use-cases/abstract-use-case';
import { isUUID } from 'class-validator';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';

export namespace UpdateAppUserUsecase {
  export type Input = {
    id: string;
    name: string;
    email: string;
    externalId: string;
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

      if (!isUUID(input.id)) {
        throw new InvalidUuidError(input.id);
      }

      await this.repository.assureAppUserExists(input.id);

      const appUser = await this.repository.findById(input.id);

      appUser.update(input.externalId, input.email, input.name);

      await this.repository.update(appUser);

      const updatedAppUser = await this.repository.findById(input.id);

      return AppUserOutputMapper.toOutput(updatedAppUser);
    }

    protected assureRequiredInputProvided(input: Input) {
      const requiredFields = ['id', 'name', 'email', 'externalId'];

      super.assureRequiredInputProvided(input, requiredFields);
    }
  }
}
