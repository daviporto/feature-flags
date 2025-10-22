import {PrismaClient} from '@prisma/client';
import {
    FeatureFlagPrismaRepository
} from '@/feature-flag/infrastructure/database/prisma/repositories/feature-flag-prisma.repository';
import {Test, TestingModule} from '@nestjs/testing';
import {setUpPrismaTest} from '@/shared/infrastructure/database/prisma/testing/set-up-prisma-test';
import {DatabaseModule} from '@/shared/infrastructure/database/database.module';
import {DeleteFeatureFlagUsecase} from '@/feature-flag/application/usecases/delete-feature-flag.usecase';
import {faker} from "@faker-js/faker";
import {
    FeatureFlagPrismaTestingHelper
} from "@/feature-flag/infrastructure/database/prisma/testing/feature-flag-prisma.testing-helper";

describe('Delete FeatureFlag usecase integration tests', () => {
    const prismaService = new PrismaClient();
    let repository: FeatureFlagPrismaRepository;
    let sut: DeleteFeatureFlagUsecase.UseCase;
    let module: TestingModule;

    beforeAll(async () => {
        setUpPrismaTest();

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)],
        }).compile();

        repository = new FeatureFlagPrismaRepository(prismaService as any);
    });

    beforeEach(async () => {
        sut = new DeleteFeatureFlagUsecase.UseCase(repository);
        await prismaService.feature_flag.deleteMany();
    });

    afterAll(async () => {
        await prismaService.$disconnect();
        await module.close();
    });

    it('should throw error when feature flag not found', () => {
        const id = faker.string.uuid();
        expect(() => sut.execute({id})).rejects.toThrow(
            new FeatureFlagWithIdNotFoundError(id),
        );
    });

    it('should delete a feature flag', async () => {
        const featureFlag = await FeatureFlagPrismaTestingHelper.createFeatureFlagAsEntity();

        await sut.execute({id: featureFlag.id});

        const featureFlagCount = await prismaService.featureFlag.count({
            where: {id: featureFlag.id},
        });
        expect(featureFlagCount).toBe(0);
    });
});
