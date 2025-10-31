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
import { SignUpDto } from '@/user/infrastructure/dtos/sign-up.dto';
import { AuthService } from '@/auth/infrastructure/auth.service';
import {
  FeatureFlagPrismaTestingHelper
} from '@/feature-flag/infrastructure/database/prisma/testing/feature-flag-prisma.testing-helper';

describe('Get feature flag e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let featureFlagRepository: FeatureFlagRepository.Repository;
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

  it('should get a feature flag', async () => {
    const featureFlagCreated =
      await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService);

    const response = await request(app.getHttpServer())
      .get(`/feature-flag/${featureFlagCreated.id}`)
      .set('Authorization', authToken)
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
      id: featureFlagCreated.id,
      name: featureFlagCreated.name,
      description: featureFlagCreated.description,
      enabled: featureFlagCreated.enabled,
      createdAt: expect.any(String),
    });

    const featureFlag = await featureFlagRepository.findById(
      response.body.data.id,
    );

    const presenter = FeatureFlagController.featureFlagToResponse(
      featureFlag.toJSON(),
    );
    const serialized = instanceToPlain(presenter);

    expect(response.body.data).toStrictEqual(serialized);
  });

  it('should return error when unauthorized', async () => {
    const featureFlagCreated =
      await FeatureFlagPrismaTestingHelper.createFeatureFlag(prismaService);

    await request(app.getHttpServer())
      .get(`/feature-flag/${featureFlagCreated.id}`)
      .expect(401);
  });

  it('should return error when feature flag not found', async () => {
    const fakeId = faker.string.uuid();

    const response = await request(app.getHttpServer())
      .get(`/feature-flag/${fakeId}`)
      .set('Authorization', authToken)
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Not Found',
      message: `Feature flag having id ${fakeId} not found`,
      statusCode: 404,
    });
  });
});
