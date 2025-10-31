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

describe('List feature flags e2e tests', () => {
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

  it('should list feature flags', async () => {
    const featureFlags = [];
    for (let i = 0; i < 3; i++) {
      const featureFlag = await prismaService.featureFlag.create({
        data: {
          name: faker.lorem.word(),
          description: faker.lorem.sentence(),
          enabled: faker.datatype.boolean(),
          userId: userId,
        },
      });
      featureFlags.push(featureFlag);
    }

    const response = await request(app.getHttpServer())
      .get('/feature-flag')
      .set('Authorization', authToken)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');

    expect(response.body.meta).toMatchObject({
      total: 3,
      perPage: 10,
      currentPage: 1,
      lastPage: 1,
    });

    expect(response.body.data).toHaveLength(3);
    expect(Object.keys(response.body.data[0])).toStrictEqual([
      'id',
      'name',
      'description',
      'enabled',
      'createdAt',
      'updatedAt',
    ]);

    const responseIds = response.body.data.map((item: any) => item.id);
    const createdIds = featureFlags.map((flag) => flag.id);
    expect(responseIds).toEqual(expect.arrayContaining(createdIds));

    const firstFeatureFlag = featureFlags[0];
    const responseItem = response.body.data.find(
      (item: any) => item.id === firstFeatureFlag.id,
    );

    expect(responseItem).toMatchObject({
      id: firstFeatureFlag.id,
      name: firstFeatureFlag.name,
      description: firstFeatureFlag.description,
      enabled: firstFeatureFlag.enabled,
      createdAt: expect.any(String),
    });

    const featureFlag = await featureFlagRepository.findById(responseItem.id);
    const presenter = FeatureFlagController.featureFlagToResponse(
      featureFlag.toJSON(),
    );
    const serialized = instanceToPlain(presenter);
    expect(responseItem).toStrictEqual(serialized);
  });

  it('should list feature flags with pagination', async () => {
    const featureFlags = [];
    for (let i = 0; i < 5; i++) {
      const featureFlag = await prismaService.featureFlag.create({
        data: {
          name: faker.lorem.word(),
          description: faker.lorem.sentence(),
          enabled: faker.datatype.boolean(),
          userId: userId,
        },
      });
      featureFlags.push(featureFlag);
    }

    const response = await request(app.getHttpServer())
      .get('/feature-flag?page=1&perPage=2')
      .set('Authorization', authToken)
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('meta');

    expect(response.body.meta).toMatchObject({
      total: 5,
      perPage: 2,
      currentPage: 1,
      lastPage: 3,
    });

    expect(response.body.data).toHaveLength(2);
  });

  it('should list feature flags with sorting', async () => {
    const names = ['zebra', 'alpha', 'beta'];
    const featureFlags = [];
    for (let i = 0; i < 3; i++) {
      const featureFlag = await prismaService.featureFlag.create({
        data: {
          name: names[i],
          description: faker.lorem.sentence(),
          enabled: faker.datatype.boolean(),
          userId: userId,
        },
      });
      featureFlags.push(featureFlag);
    }

    const responseAsc = await request(app.getHttpServer())
      .get('/feature-flag?sort=name&sortDir=asc')
      .set('Authorization', authToken)
      .expect(200);

    expect(responseAsc.body.data[0].name).toBe('alpha');
    expect(responseAsc.body.data[1].name).toBe('beta');
    expect(responseAsc.body.data[2].name).toBe('zebra');

    const responseDesc = await request(app.getHttpServer())
      .get('/feature-flag?sort=name&sortDir=desc')
      .set('Authorization', authToken)
      .expect(200);

    expect(responseDesc.body.data[0].name).toBe('zebra');
    expect(responseDesc.body.data[1].name).toBe('beta');
    expect(responseDesc.body.data[2].name).toBe('alpha');
  });

  it('should list feature flags with filtering', async () => {
    const featureFlag1 = await prismaService.featureFlag.create({
      data: {
        name: 'feature-one',
        description: 'This is the first feature',
        enabled: true,
        userId: userId,
      },
    });

    await prismaService.featureFlag.create({
      data: {
        name: 'feature-two',
        description: 'This is the second feature',
        enabled: false,
        userId: userId,
      },
    });

    const responseName = await request(app.getHttpServer())
      .get('/feature-flag?filter[name]=one')
      .set('Authorization', authToken)
      .expect(200);

    expect(responseName.body.data).toHaveLength(1);
    expect(responseName.body.data[0].id).toBe(featureFlag1.id);

    const responseEnabled = await request(app.getHttpServer())
      .get('/feature-flag?filter[enabled]=true')
      .set('Authorization', authToken)
      .expect(200);

    expect(responseEnabled.body.data).toHaveLength(1);
    expect(responseEnabled.body.data[0].id).toBe(featureFlag1.id);
  });

  it('should return error when unauthorized', async () => {
    await request(app.getHttpServer()).get('/feature-flag').expect(401);
  });
});
