import {PrismaClient} from '@prisma/client';
import {
  FeatureFlagPrismaRepository
} from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import {Test, TestingModule} from '@nestjs/testing';
import {setUpPrismaTest} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import {DatabaseModule} from '@/shared/infrastructure/database/database.module';
import {UpdateFeatureFlagUsecase} from '@/feature-flag/application/usecases/update-feature-flag.usecase';

describe('Update featureFlag usecase integration tests', () => {
    const prismaService = new PrismaClient();
    let repository: FeatureFlagPrismaRepository;
    let sut: UpdateFeatureFlagUsecase.UseCase;
    let module: TestingModule;

    beforeAll(async () => {
        setUpPrismaTest();

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)],
        }).compile();

        repository = new FeatureFlagPrismaRepository(prismaService as any);
    });

    beforeEach(async () => {
        sut = new UpdateFeatureFlagUsecase.UseCase(repository);
        await prismaService.featureFlag.deleteMany();
    });

    afterAll(async () => {
        await prismaService.$disconnect();
        await module.close();
    });

    it.todo('should throw error when featureFlag not found');

    it.todo('should update a featureFlag');
});
