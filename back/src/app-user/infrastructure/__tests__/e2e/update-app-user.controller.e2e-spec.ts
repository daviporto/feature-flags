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
import { AppUserController } from '@/app-user/infrastructure/app-user.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { UpdateAppUserDto } from '@/app-user/infrastructure/dtos/update-app-user.dto';
import { SignUpDto } from '@/user/infrastructure/dtos/sign-up.dto';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { AppUserPrismaTestingHelper } from '@/app-user/infrastructure/database/prisma/testing/app-user-prisma.testing-helper';

describe('Update app user e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let updateAppUserDto: UpdateAppUserDto;
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
  });

  beforeEach(async () => {
    updateAppUserDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      externalId: faker.string.uuid(),
    };

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

  it('should update a app user', async () => {
    const appUser =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    const response = await request(app.getHttpServer())
      .put(`/app-user/${appUser.id}`)
      .set('Authorization', authToken)
      .send(updateAppUserDto)
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
      id: appUser.id,
      name: updateAppUserDto.name,
      email: updateAppUserDto.email,
      externalId: updateAppUserDto.externalId,
      createdAt: expect.any(String),
    });

    const updatedAppUser = await prismaService.appUser.findUnique({
      where: { id: response.body.data.id },
    });

    const presenter = AppUserController.appUserToResponse(updatedAppUser);
    const serialized = instanceToPlain(presenter);

    expect(response.body.data).toStrictEqual(serialized);
  });

  it('should return error when no parameter in body', async () => {
    const appUser =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    const response = await request(app.getHttpServer())
      .put(`/app-user/${appUser.id}`)
      .set('Authorization', authToken)
      .send()
      .expect(422);

    expect(response.body).toHaveProperty('error');

    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      statusCode: 422,
    });

    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'email must be an email',
        'email should not be empty',
        'name should not be empty',
        'name must be a string',
        'externalId must be a string',
        'externalId should not be empty',
      ]),
    );
  });

  it('should return error when name is not a string', async () => {
    const appUser =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    const response = await request(app.getHttpServer())
      .put(`/app-user/${appUser.id}`)
      .set('Authorization', authToken)
      .send({
        ...updateAppUserDto,
        name: 123 as any,
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['name must be a string'],
      statusCode: 422,
    });
  });

  it('should return error when email is not valid', async () => {
    const appUser =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    const response = await request(app.getHttpServer())
      .put(`/app-user/${appUser.id}`)
      .set('Authorization', authToken)
      .send({
        ...updateAppUserDto,
        email: 'invalid-email',
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['email must be an email'],
      statusCode: 422,
    });
  });

  it('should return error when externalId is not a string', async () => {
    const appUser =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    const response = await request(app.getHttpServer())
      .put(`/app-user/${appUser.id}`)
      .set('Authorization', authToken)
      .send({
        ...updateAppUserDto,
        externalId: 123 as any,
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['externalId must be a string'],
      statusCode: 422,
    });
  });

  it('should return error with invalid property', async () => {
    const appUser =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    const response = await request(app.getHttpServer())
      .put(`/app-user/${appUser.id}`)
      .set('Authorization', authToken)
      .send({
        ...updateAppUserDto,
        invalid: 'invalid',
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['property invalid should not exist'],
      statusCode: 422,
    });
  });

  it('should return error when unauthorized', async () => {
    const appUser =
      await AppUserPrismaTestingHelper.createAppUser(prismaService);

    await request(app.getHttpServer())
      .put(`/app-user/${appUser.id}`)
      .send(updateAppUserDto)
      .expect(401);
  });

  it('should return error when app user not found', async () => {
    const fakeId = faker.string.uuid();

    const response = await request(app.getHttpServer())
      .put(`/app-user/${fakeId}`)
      .set('Authorization', authToken)
      .send(updateAppUserDto)
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Not Found',
      message: `App User having id ${fakeId} not found`,
      statusCode: 404,
    });
  });
});
