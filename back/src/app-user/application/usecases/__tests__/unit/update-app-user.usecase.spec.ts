import { AppUserInMemoryRepository } from '@/app-user/infrastructure/database/in-memory/repositories/app-user-in-memory.repository';
import { UpdateAppUserUsecase } from '@/app-user/application/usecases/update-app-user.usecase';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { AppUserWithIdNotFoundError } from '@/app-user/infrastructure/errors/app-user-with-id-not-found-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { v4 } from 'uuid';
import { InvalidUuidError } from '@/shared/application/errors/invalid-uuid-error';

describe('Update appuser use case test', () => {
  let sut: UpdateAppUserUsecase.UseCase;
  let repository: AppUserInMemoryRepository;

  beforeEach(() => {
    repository = new AppUserInMemoryRepository();
    sut = new UpdateAppUserUsecase.UseCase(repository);
  });

  it('should throw invalidUuid if appuser id is not valid', async () => {
    const appUser = new AppUserEntity(AppUserDataBuilder());

    const input = {
      id: 'random',
      name: appUser.name,
      email: appUser.email,
      externalId: appUser.externalId,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(InvalidUuidError);
  });

  it('should throw appuserWithIdNotFoundError if appuser does not exist', async () => {
    const appUser = new AppUserEntity(AppUserDataBuilder());

    const input = {
      id: v4(),
      name: appUser.name,
      email: appUser.email,
      externalId: appUser.externalId,
    };

    await expect(() => sut.execute(input)).rejects.toThrow(
      AppUserWithIdNotFoundError,
    );
  });

  describe('missing parameters', () => {
    it('should throw error when missing id', async () => {
      const appUser = new AppUserEntity(AppUserDataBuilder());

      const input = {
        name: appUser.name,
        email: appUser.email,
        externalId: appUser.externalId,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing name', async () => {
      const appUser = new AppUserEntity(AppUserDataBuilder());

      const input = {
        id: 'random',
        email: appUser.email,
        externalId: appUser.externalId,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing email', async () => {
      const appUser = new AppUserEntity(AppUserDataBuilder());

      const input = {
        id: 'random',
        name: appUser.name,
        externalId: appUser.externalId,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });

    it('should throw error when missing externalId', async () => {
      const appUser = new AppUserEntity(AppUserDataBuilder());

      const input = {
        id: 'random',
        name: appUser.name,
        email: appUser.email,
      };

      await expect(sut.execute(input as any)).rejects.toThrow(BadRequestError);
    });
  });

  it('should update an appuser', async () => {
    const appUser = new AppUserEntity(AppUserDataBuilder());
    repository.items = [appUser];

    const newName = 'New Name';
    const newEmail = 'newemail@example.com';
    const newExternalId = 'new-external-id';

    const input = {
      id: appUser.id,
      name: newName,
      email: newEmail,
      externalId: newExternalId,
    };

    const output = await sut.execute(input);

    expect(output).toBeDefined();
    expect(output.id).toBe(appUser.id);
    expect(output.name).toBe(newName);
    expect(output.email).toBe(newEmail);
    expect(output.externalId).toBe(newExternalId);
    expect(output.updatedAt).toBeDefined();
  });
});
