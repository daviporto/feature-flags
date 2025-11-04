import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import {
    setUpPrismaTest,
} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import { FeatureFlagModule } from '@/feature-flag/infrastructure/feature-flag.module';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { AppUserRepository } from '@/app-user/domain/repositories/app-user.repository';
import { CreateAppUserDto } from '../../dtos/create-app-user.dto';
import { AppUserController } from '../../app-user.controller';

describe('Create app user e2e tests', () => {
    let app: INestApplication;
    let module: TestingModule;
    let appUserRepository: AppUserRepository.Repository;
    let createAppUserDto: CreateAppUserDto;
    let authToken: string;
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

        appUserRepository = module.get<AppUserRepository.Repository>(
            'AppUserRepository',
        );
    });

    it('should create a feature flag', async () => {
        const response = await request(app.getHttpServer())
            .post('/app-user')
            .send(createAppUserDto)
            .expect(201);

        expect(response.body).toHaveProperty('data');

        expect(Object.keys(response.body.data)).toStrictEqual([
            'externalId',
            'name',
            'email',
            'createdAt',
            'updatedAt',
        ]);

        expect(response.body.data).toMatchObject({
            externalId: expect.any(String),
            name: createAppUserDto.name,
            email: createAppUserDto.email,
            createdAt: expect.any(String)
        });

        const appUser = await appUserRepository.findById(
            response.body.data.id,
        );

        const presenter = AppUserController.appUserToResponse(
            appUser.toJSON(),
        );
        const serialized = instanceToPlain(presenter);

        expect(response.body.data).toStrictEqual(serialized);
    });

    it('should return error when no parameter in body', async () => {
        const response = await request(app.getHttpServer())
            .post('/app-user')
            .send()
            .expect(422);

        expect(response.body).toHaveProperty('error');

        expect(response.body).toMatchObject({
            error: 'Unprocessable Entity',
            message: [
                'name should not be empty',
                'name must be a string',
                'email should not be empty',
                'email must be a string',
            ],
            statusCode: 422,
        });
    });

    it('should return error when name is not a string', async () => {
        const response = await request(app.getHttpServer())
            .post('/app-user')
            .send({
                ...createAppUserDto,
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

    it('should return error when email is not a string', async () => {
        const response = await request(app.getHttpServer())
            .post('/app-user')
            .send({
                ...createAppUserDto,
                email: 123 as any,
            })
            .expect(422);

        expect(response.body).toHaveProperty('error');
        expect(response.body).toMatchObject({
            error: 'Unprocessable Entity',
            message: ['email must be a string'],
            statusCode: 422,
        });
    });

    it('should return error with invalid property', async () => {
        const response = await request(app.getHttpServer())
            .post('/app-user')
            .send({
                ...createAppUserDto,
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
});
