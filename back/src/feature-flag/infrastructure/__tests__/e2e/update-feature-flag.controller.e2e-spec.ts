import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FeatureFlagRepository } from '@/feature-flag/domain/repositories/feature-flag.repository';
import { PrismaClient } from '@prisma/client';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { FeatureFlagModule } from '@/feature-flag/infrastructure/feature-flag.module';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { FeatureFlagController } from '@/feature-flag/infrastructure/feature-flag.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { UpdateFeatureFlagDto } from '@/feature-flag/infrastructure/dtos/update-feature-flag.dto';
import { SignUpDto } from '@/user/infrastructure/dtos/sign-up.dto';
import { AuthService } from '@/auth/infrastructure/auth.service';

describe('Update feature flag e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let featureFlagRepository: FeatureFlagRepository.Repository;
  let updateFeatureFlagDto: UpdateFeatureFlagDto;
  let authToken: string;
  let userId: string;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setUpPrismaTest();
    module = await Test.createTestingModule({
      imports: [
        FeatureFlagModule,
        EnvConfigModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    featureFlagRepository = module.get<FeatureFlagRepository.Repository>(
      'FeatureFlagRepository',
    );
  });

  beforeEach(async () => {
    updateFeatureFlagDto = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      enabled: faker.datatype.boolean(),
    };

    await prismaService.featureFlag.deleteMany();
    await prismaService.user.deleteMany();

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

  it('should update a feature flag', async () => {
    const featureFlag = await prismaService.featureFlag.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        enabled: faker.datatype.boolean(),
        userId: userId,
      },
    });

    const response = await request(app.getHttpServer())
      .put(`/feature-flag/${featureFlag.id}`)
      .set('Authorization', authToken)
      .send(updateFeatureFlagDto)
      .expect(200);

    expect(response.body).toHaveProperty('data');

    expect(Object.keys(response.body.data)).toStrictEqual([
      'id',
      'name',
      'description',
      'enabled',
      'createdAt',
      'updatedAt',
    ]);

    expect(response.body.data).toMatchObject({
      id: featureFlag.id,
      name: updateFeatureFlagDto.name,
      description: updateFeatureFlagDto.description,
      enabled: updateFeatureFlagDto.enabled,
      createdAt: expect.any(String),
    });

    const updatedFeatureFlag = await featureFlagRepository.findById(
      response.body.data.id,
    );

    const presenter = FeatureFlagController.featureFlagToResponse(
      updatedFeatureFlag.toJSON(),
    );
    const serialized = instanceToPlain(presenter);

    expect(response.body.data).toStrictEqual(serialized);
  });

  it('should return error when no parameter in body', async () => {
    const featureFlag = await prismaService.featureFlag.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        enabled: faker.datatype.boolean(),
        userId: userId,
      },
    });

    const response = await request(app.getHttpServer())
      .put(`/feature-flag/${featureFlag.id}`)
      .set('Authorization', authToken)
      .send()
      .expect(422);

    expect(response.body).toHaveProperty('error');

    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: [
        'name should not be empty',
        'name must be a string',
        'description should not be empty',
        'description must be a string',
        'enabled must be a boolean value',
        'enabled should not be empty',
      ],
      statusCode: 422,
    });
  });

  it('should return error when name is not a string', async () => {
    const featureFlag = await prismaService.featureFlag.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        enabled: faker.datatype.boolean(),
        userId: userId,
      },
    });

    const response = await request(app.getHttpServer())
      .put(`/feature-flag/${featureFlag.id}`)
      .set('Authorization', authToken)
      .send({
        ...updateFeatureFlagDto,
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

  it('should return error when description is not a string', async () => {
    const featureFlag = await prismaService.featureFlag.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        enabled: faker.datatype.boolean(),
        userId: userId,
      },
    });

    const response = await request(app.getHttpServer())
      .put(`/feature-flag/${featureFlag.id}`)
      .set('Authorization', authToken)
      .send({
        ...updateFeatureFlagDto,
        description: 123 as any,
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['description must be a string'],
      statusCode: 422,
    });
  });

  it('should return error when enabled is not a boolean', async () => {
    const featureFlag = await prismaService.featureFlag.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        enabled: faker.datatype.boolean(),
        userId: userId,
      },
    });

    const response = await request(app.getHttpServer())
      .put(`/feature-flag/${featureFlag.id}`)
      .set('Authorization', authToken)
      .send({
        ...updateFeatureFlagDto,
        enabled: 'not-a-boolean' as any,
      })
      .expect(422);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Unprocessable Entity',
      message: ['enabled must be a boolean value'],
      statusCode: 422,
    });
  });

  it('should return error with invalid property', async () => {
    const featureFlag = await prismaService.featureFlag.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        enabled: faker.datatype.boolean(),
        userId: userId,
      },
    });

    const response = await request(app.getHttpServer())
      .put(`/feature-flag/${featureFlag.id}`)
      .set('Authorization', authToken)
      .send({
        ...updateFeatureFlagDto,
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
    const featureFlag = await prismaService.featureFlag.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        enabled: faker.datatype.boolean(),
        userId: userId,
      },
    });

    await request(app.getHttpServer())
      .put(`/feature-flag/${featureFlag.id}`)
      .send(updateFeatureFlagDto)
      .expect(401);
  });

  it('should return error when feature flag not found', async () => {
    const fakeId = faker.string.uuid();

    const response = await request(app.getHttpServer())
      .put(`/feature-flag/${fakeId}`)
      .set('Authorization', authToken)
      .send(updateFeatureFlagDto)
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Not Found',
      message: `Feature flag having id ${fakeId} not found`,
      statusCode: 404,
    });
  });
});
