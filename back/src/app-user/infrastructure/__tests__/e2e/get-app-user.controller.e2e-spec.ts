import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import {
  resetDatabase,
  setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { SignUpDto } from '@/user/infrastructure/dtos/sign-up.dto';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { AppUserModule } from '@/app-user/infrastructure/app-user.module';
import { AppUserPrismaTestingHelper } from '@/app-user/infrastructure/database/prisma/testing/app-user-prisma.testing-helper';
import { AppUserController } from '@/app-user/infrastructure/app-user.controller';

describe('Get app user e2e tests', () => {
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

  it('should get a app user', async () => {
    const userCreated =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    const response = await request(app.getHttpServer())
      .get(`/app-user/${userCreated.id}`)
      .set('Authorization', authToken)
      .expect(200);

    expect(response.body).toHaveProperty('data');

    expect(Object.keys(response.body.data)).toStrictEqual([
      'id',
      'name',
      'email',
      'externalId',
      'createdAt',
      'updatedAt',
    ]);

    expect(response.body.data).toMatchObject({
      id: userCreated.id,
      name: userCreated.name,
      email: userCreated.email,
      externalId: userCreated.externalId,
      createdAt: expect.any(String),
    });

    const appUser = await appUserRepository.findById(response.body.data.id);

    const presenter = AppUserController.appUserToResponse(appUser.toJSON());
    const serialized = instanceToPlain(presenter);

    expect(response.body.data).toStrictEqual(serialized);
  });

  it('should return error when unauthorized', async () => {
    const appUserCreated =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    await request(app.getHttpServer())
      .get(`/app-user/${appUserCreated.id}`)
      .expect(401);
  });

  it('should return error when app user not found', async () => {
    const fakeId = faker.string.uuid();

    const response = await request(app.getHttpServer())
      .get(`/app-user/${fakeId}`)
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
