import {
  AppUserCollectionPresenter,
  AppUserPresenter,
} from '@/app-user/infrastructure/presenters/app-user.presenter';
import { faker } from '@faker-js/faker';
import { instanceToPlain } from 'class-transformer';
import { ListAppUsersUsecase } from '@/app-user/application/usecases/list-app-user.usecase';

describe('AppUser presenter unit tests', () => {
  describe('AppUserPresenter', () => {
    const id = faker.string.uuid();
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const externalId = faker.string.uuid();
    const createdAt = new Date();
    const updatedAt = new Date();

    let props: {
      id: string;
      name: string;
      email: string;
      externalId: string;
      createdAt: Date;
      updatedAt: Date;
    };
    let sut: AppUserPresenter;

    beforeEach(() => {
      props = {
        id,
        name,
        email,
        externalId,
        createdAt,
        updatedAt,
      };
      sut = new AppUserPresenter(props);
    });

    it('Constructor', () => {
      expect(sut).toBeDefined();
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.externalId).toEqual(props.externalId);
      expect(sut.createdAt).toEqual(props.createdAt);
      expect(sut.updatedAt).toEqual(props.updatedAt);
    });

    it('Should present the data as expected with transformed dates', () => {
      const output = instanceToPlain(sut);

      expect(output).toBeDefined();
      expect(output.id).toEqual(id);
      expect(output.name).toEqual(name);
      expect(output.email).toEqual(email);
      expect(output.externalId).toEqual(externalId);
      expect(output.createdAt).toEqual(createdAt.toISOString());
      expect(output.updatedAt).toEqual(updatedAt.toISOString());
    });
  });

  describe('AppUserCollectionPresenter', () => {
    let output: ListAppUsersUsecase.Output;
    let sut: AppUserCollectionPresenter;

    beforeEach(() => {
      const items = Array.from({ length: 3 }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        externalId: faker.string.uuid(),
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

      sut = new AppUserCollectionPresenter(output);
    });

    it('Constructor', () => {
      expect(sut).toBeDefined();
      expect(sut.data).toHaveLength(output.items.length);
      expect(sut.data[0]).toBeInstanceOf(AppUserPresenter);
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
        expect(item.email).toEqual(output.items[index].email);
        expect(item.externalId).toEqual(output.items[index].externalId);
        expect(item.createdAt).toEqual(
          output.items[index].createdAt.toISOString(),
        );
        expect(item.updatedAt).toEqual(
          output.items[index].updatedAt.toISOString(),
        );
      });
    });

    it('Should handle empty collection', () => {
      const emptyOutput: ListAppUsersUsecase.Output = {
        items: [],
        total: 0,
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
      };

      const emptySut = new AppUserCollectionPresenter(emptyOutput);
      const presentation = instanceToPlain(emptySut);

      expect(presentation.data).toHaveLength(0);
      expect(presentation.meta.total).toEqual(0);
    });
  });
});
