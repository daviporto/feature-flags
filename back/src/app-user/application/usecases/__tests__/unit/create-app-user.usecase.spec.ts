import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { v4 } from 'uuid';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';
import { CreateAppUserUsecase } from '@/app-user/application/usecases/create-app-user.usecase';
import { AppUserInMemoryRepository } from '@/app-user/infrastructure/database/in-memory/repositories/app-user-in-memory.repository';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';

describe('Create app user use case test', () => {
  let sut: CreateAppUserUsecase.UseCase;
  let repository: AppUserInMemoryRepository;

  beforeEach(() => {
    repository = new AppUserInMemoryRepository();

    sut = new CreateAppUserUsecase.UseCase(repository);
  });

  it('should throw invalidUUid if external id not valid uuid', async () => {
    const ff = new AppUserEntity(AppUserDataBuilder());

    const input: CreateAppUserUsecase.Input = {
      name: ff.name,
      email: ff.email,
      externalId: 'not a valid uuid'
    };

    await expect(() => sut.execute(input)).rejects.toThrow(InvalidUuidError);
  });

  it('should throw userWithIdNotFoundError if user does not exist', async () => {
    const ff = new AppUserEntity(AppUserDataBuilder());

    const input = {
      externalId: v4(),
      name: ff.name,
      email: ff.email,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      UserWithIdNotFoundError,
    );
  });

  describe('missing parameters', () => {
    it('should throw error when missing externalId', async () => {
      const ff = new AppUserEntity(AppUserDataBuilder());

      const input = {
        name: ff.name,
        email: ff.email,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing name', async () => {
      const ff = new AppUserEntity(AppUserDataBuilder());

      const input = {
        externalId: 'random',
        email: ff.email,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing email', async () => {
      const ff = new AppUserEntity(AppUserDataBuilder());

      const input = {
        externalId: 'random',
        name: ff.name,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });
  });
});
