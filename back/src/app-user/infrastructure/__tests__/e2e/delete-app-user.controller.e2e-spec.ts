import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { AppUserModule } from '@/app-user/infrastructure/app-user.module';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { applyGlobalConfig } from '@/global-config';
import { SignUpDto } from '@/user/infrastructure/dtos/sign-up.dto';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { AppUserPrismaTestingHelper } from '@/app-user/infrastructure/database/prisma/testing/app-user-prisma.testing-helper';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';

describe('Delete app user e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let appUserRepository: AppUserRepository.Repository;
  let authToken: string;
  let userId: string;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setUpPrismaTest();
    module = await Test.createTestingModule({
      imports: [
        AppUserModule,
        EnvConfigModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    appUserRepository =
      module.get<AppUserRepository.Repository>('AppUserRepository');
  });

  beforeEach(async () => {
    await resetDatabase(prismaService);

    const signUpDto: SignUpDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const userCreated = await prismaService.user.create({ data: signUpDto });
    userId = userCreated.id;
    const authService = module.get(AuthService);
    const tokenObj = await authService.generateJwt(userId);
    authToken = `Bearer ${tokenObj.accessToken}`;
  });

  it('should delete a app user', async () => {
    const appUserCreated =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    await request(app.getHttpServer())
      .delete(`/app-user/${appUserCreated.id}`)
      .set('Authorization', authToken)
      .expect(204);

    await expect(
      appUserRepository.findById(appUserCreated.id),
    ).rejects.toThrow();
  });

  it('should return error when unauthorized', async () => {
    const appUserCreated =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    await request(app.getHttpServer())
      .delete(`/app-user/${appUserCreated.id}`)
      .expect(401);
  });

  it('should return error when app user not found', async () => {
    const fakeId = faker.string.uuid();

    const response = await request(app.getHttpServer())
      .delete(`/app-user/${fakeId}`)
      .set('Authorization', authToken)
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Not Found',
      message: `App User having id ${fakeId} not found`,
      statusCode: 404,
    });
  });
});
