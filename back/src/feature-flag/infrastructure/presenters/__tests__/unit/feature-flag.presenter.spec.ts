import {FeatureFlagOutput} from '@/feature-flag/application/dtos/feature-flag-output';
import {
    FeatureFlagCollectionPresenter,
    FeatureFlagPresenter
} from '@/feature-flag/infrastructure/presenters/feature-flag.presenter';
import {faker} from '@faker-js/faker';
import {instanceToPlain} from 'class-transformer';
import {ListFeatureFlagsUsecase} from "@/feature-flag/application/usecases/list-feature-flag.usecase";

describe('FeatureFlag presenter unit tests', () => {
    describe('FeatureFlagPresenter', () => {
        const id = faker.string.uuid();
        const name = faker.lorem.word();
        const description = faker.lorem.sentence();
        const enabled = faker.datatype.boolean();
        const createdAt = new Date();
        const updatedAt = new Date();
        const userId = faker.string.uuid();

        let props: FeatureFlagOutput;
        let sut: FeatureFlagPresenter;

        beforeEach(() => {
            props = {
                id,
                name,
                description,
                enabled,
                createdAt,
                updatedAt,
                userId
            };
            sut = new FeatureFlagPresenter(props);
        });

        it('Constructor', () => {
            expect(sut).toBeDefined();
            expect(sut.name).toEqual(props.name);
            expect(sut.description).toEqual(props.description);
            expect(sut.enabled).toEqual(props.enabled);
            expect(sut.createdAt).toEqual(props.createdAt);
            expect(sut.updatedAt).toEqual(props.updatedAt);
        });

        it('Should present the data as expected with transformed dates', () => {
            const output = instanceToPlain(sut);

            expect(output).toBeDefined();
            expect(output.id).toEqual(id);
            expect(output.name).toEqual(name);
            expect(output.description).toEqual(description);
            expect(output.enabled).toEqual(enabled);
            expect(output.createdAt).toEqual(createdAt.toISOString());
            expect(output.updatedAt).toEqual(updatedAt.toISOString());
        });
    });

    describe('FeatureFlagCollectionPresenter', () => {
        let output: ListFeatureFlagsUsecase.Output;
        let sut: FeatureFlagCollectionPresenter;

        beforeEach(() => {
            const items = Array.from({length: 3}, (_, index) => ({
                id: faker.string.uuid(),
                name: faker.lorem.word(),
                description: faker.lorem.sentence(),
                enabled: faker.datatype.boolean(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            output = {
                items,
                total: items.length,
                currentPage: 1,
                lastPage: 1,
                perPage: 10,
            };

            sut = new FeatureFlagCollectionPresenter(output);
        });

        it('Constructor', () => {
            expect(sut).toBeDefined();
            expect(sut.data).toHaveLength(output.items.length);
            expect(sut.data[0]).toBeInstanceOf(FeatureFlagPresenter);
            expect(sut.meta).toEqual({
                total: output.total,
                currentPage: output.currentPage,
                lastPage: output.lastPage,
                perPage: output.perPage,
            });
        });

        it('Should present the collection data as expected', () => {
            const presentation = instanceToPlain(sut);

            expect(presentation).toBeDefined();
            expect(presentation.meta).toEqual({
                total: output.total,
                currentPage: output.currentPage,
                lastPage: output.lastPage,
                perPage: output.perPage,
            });
            expect(presentation.data).toHaveLength(output.items.length);

            presentation.data.forEach((item: any, index: number) => {
                expect(item.id).toEqual(output.items[index].id);
                expect(item.name).toEqual(output.items[index].name);
                expect(item.description).toEqual(output.items[index].description);
                expect(item.enabled).toEqual(output.items[index].enabled);
                expect(item.createdAt).toEqual(output.items[index].createdAt.toISOString());
                expect(item.updatedAt).toEqual(output.items[index].updatedAt.toISOString());
            });
        });

        it('Should handle empty collection', () => {
            const emptyOutput: ListFeatureFlagsUsecase.Output = {
                items: [],
                total: 0,
                currentPage: 1,
                lastPage: 1,
                perPage: 10,
            };

            const emptySut = new FeatureFlagCollectionPresenter(emptyOutput);
            const presentation = instanceToPlain(emptySut);

            expect(presentation.data).toHaveLength(0);
            expect(presentation.meta.total).toEqual(0);
        });
    });
});
