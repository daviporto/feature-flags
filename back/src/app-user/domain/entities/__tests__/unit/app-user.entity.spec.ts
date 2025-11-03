import { faker } from '@faker-js/faker';
import {
  AppUserEntity,
  AppUserProps,
} from '@/app-user/domain/entities/app-user.entity';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';

function commonAssertions(sut: AppUserEntity, props: AppUserProps) {
  expect(sut).toBeDefined();
  expect(sut).toBeInstanceOf(AppUserEntity);
  expect(AppUserEntity.validate).toHaveBeenCalled();

  expect(sut.props.name).toBe(props.name);
  expect(sut.props.email).toBe(props.email);
  expect(sut.props.externalId).toBe(props.externalId);
}

describe('AppUser entity unit tests', () => {
  let sut: AppUserEntity;

  beforeEach(() => {
    AppUserEntity.validate = jest.fn();
  });

  it('test constructor without createdAt and updatedAt', () => {
    const props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      externalId: faker.string.uuid(),
    };

    sut = new AppUserEntity(props);

    commonAssertions(sut, props);

    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBeInstanceOf(Date);
    expect(sut.props.updatedAt).toBeUndefined();
  });

  it('test constructor with createdAt', () => {
    const createdAt = new Date();
    const props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      externalId: faker.string.uuid(),
      createdAt,
    };

    sut = new AppUserEntity(props);

    commonAssertions(sut, props);

    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBe(createdAt);
    expect(sut.props.updatedAt).toBeUndefined();
  });

  it('test constructor with createdAt and updatedAt', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      externalId: faker.string.uuid(),
      createdAt,
      updatedAt,
    };

    sut = new AppUserEntity(props);

    commonAssertions(sut, props);

    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBe(createdAt);
    expect(sut.props.updatedAt).toBeDefined();
    expect(sut.props.updatedAt).toBe(updatedAt);
  });

  it('test constructor with id', () => {
    const props = AppUserDataBuilder({});
    const id = faker.string.uuid();

    sut = new AppUserEntity(props, id);

    commonAssertions(sut, props);
    expect(sut.id).toBe(id);
    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('test externalId getter', () => {
    const externalId = faker.string.uuid();
    sut = new AppUserEntity(AppUserDataBuilder({ externalId }));

    expect(sut.externalId).toBeDefined();
    expect(typeof sut.externalId).toBe('string');
    expect(sut.externalId).toBe(externalId);
  });

  it('test email getter', () => {
    const email = faker.internet.email();
    sut = new AppUserEntity(AppUserDataBuilder({ email }));

    expect(sut.email).toBeDefined();
    expect(typeof sut.email).toBe('string');
    expect(sut.email).toBe(email);
  });

  it('test name getter', () => {
    const name = faker.person.fullName();
    sut = new AppUserEntity(AppUserDataBuilder({ name }));

    expect(sut.name).toBeDefined();
    expect(typeof sut.name).toBe('string');
    expect(sut.name).toBe(name);
  });

  it('test createdAt getter', () => {
    const createdAt = new Date();
    sut = new AppUserEntity(AppUserDataBuilder({ createdAt }));

    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.createdAt).toBe(createdAt);
  });

  it('test update method for multiple properties', () => {
    sut = new AppUserEntity(AppUserDataBuilder({}));
    const newExternalId = faker.string.uuid();
    const newEmail = faker.internet.email();
    const newName = faker.person.fullName();

    sut.update(newExternalId, newEmail, newName);

    expect(sut.externalId).toBe(newExternalId);
    expect(sut.email).toBe(newEmail);
    expect(sut.name).toBe(newName);
    expect(sut.props.updatedAt).toBeDefined();
    expect(sut.props.updatedAt).toBeInstanceOf(Date);
    expect(AppUserEntity.validate).toHaveBeenCalledWith({
      ...sut.props,
      externalId: newExternalId,
      email: newEmail,
      name: newName,
    });
  });
});
