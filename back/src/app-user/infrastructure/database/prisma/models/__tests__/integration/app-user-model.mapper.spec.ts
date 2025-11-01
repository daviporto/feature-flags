import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { AppUser } from '@prisma/client';
import { AppUserModelMapper } from '@/app-user/infrastructure/database/prisma/models/app-user-model.mapper';
import { ValidationErrors } from '@/shared/domain/errors/validation-errors';
import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { setUpPrismaTest } from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';

describe('AppUser model mapper integration tests', () => {
  let prismaService: PrismaService;
  let props: any;

  beforeAll(async () => {
    setUpPrismaTest();

    prismaService = new PrismaService();
    props = AppUserDataBuilder({});
    await prismaService.$connect();
  });

  beforeEach(() => {
    prismaService.appUser.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throw error when appUser model is invalid', () => {
    const model: AppUser = Object.assign({}, props, { name: null });

    expect(() => AppUserModelMapper.toEntity(model)).toThrow(
      new ValidationErrors('Could not load appUser having id undefined'),
    );
  });

  it('should map appuser model to entity', async () => {
    const model: AppUser = await prismaService.appUser.create({
      data: props,
    });

    const sut = AppUserModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(AppUserEntity);
  });
});
