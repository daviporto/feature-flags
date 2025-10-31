import { faker } from '@faker-js/faker';
import {
  FeatureFlagEntity,
  FeatureFlagProps,
} from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';
import { EntityValidationError } from '@/shared/domain/errors/validation-errors';
import { FeatureFlagValidatorFactory } from '@/feature-flag/domain/validators/feature-flag.validator';

function commonAssertions(sut: FeatureFlagEntity, props: FeatureFlagProps) {
  expect(sut).toBeDefined();
  expect(sut).toBeInstanceOf(FeatureFlagEntity);
  expect(FeatureFlagEntity.validate).toHaveBeenCalled();

  expect(sut.props.name).toBe(props.name);
  expect(sut.props.description).toBe(props.description);
  expect(sut.props.enabled).toBe(props.enabled);
  expect(sut.props.userId).toBe(props.userId);
}

describe('FeatureFlag entity unit tests', () => {
  let sut: FeatureFlagEntity;

  beforeEach(() => {
    FeatureFlagEntity.validate = jest.fn();
  });

  it('test constructor without createdAt and updatedAt', () => {
    const props = {
      name: faker.string.alphanumeric(),
      description: faker.string.alphanumeric(),
      enabled: faker.datatype.boolean(),
      userId: faker.string.uuid(),
    };

    sut = new FeatureFlagEntity(props);

    commonAssertions(sut, props);

    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBeInstanceOf(Date);
    expect(sut.props.updatedAt).toBeUndefined();
  });

  it('test constructor with createdAt', () => {
    const createdAt = new Date();
    const props = {
      name: faker.string.alphanumeric(),
      description: faker.string.alphanumeric(),
      enabled: faker.datatype.boolean(),
      userId: faker.string.uuid(),
      createdAt,
    };

    sut = new FeatureFlagEntity(props);

    commonAssertions(sut, props);

    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBe(createdAt);
    expect(sut.props.updatedAt).toBeUndefined();
  });

  it('test constructor with createdAt and updatedAt', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const props = {
      name: faker.string.alphanumeric(),
      description: faker.string.alphanumeric(),
      enabled: faker.datatype.boolean(),
      userId: faker.string.uuid(),
      createdAt,
      updatedAt,
    };

    sut = new FeatureFlagEntity(props);

    commonAssertions(sut, props);

    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBe(createdAt);
    expect(sut.props.updatedAt).toBeDefined();
    expect(sut.props.updatedAt).toBe(updatedAt);
  });

  it('test constructor with id', () => {
    const props = FeatureFlagDataBuilder({});
    const id = faker.string.uuid();

    sut = new FeatureFlagEntity(props, id);

    commonAssertions(sut, props);
    expect(sut.id).toBe(id);
    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('test name getter', () => {
    const name = faker.string.alphanumeric();
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({ name }));

    expect(sut.name).toBeDefined();
    expect(typeof sut.name).toBe('string');
    expect(sut.name).toBe(name);
  });

  it('test description getter', () => {
    const description = faker.string.alphanumeric();
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({ description }));

    expect(sut.description).toBeDefined();
    expect(typeof sut.description).toBe('string');
    expect(sut.description).toBe(description);
  });

  it('test enabled getter', () => {
    const enabled = faker.datatype.boolean();
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({ enabled }));

    expect(sut.enabled).toBeDefined();
    expect(typeof sut.enabled).toBe('boolean');
    expect(sut.enabled).toBe(enabled);
  });

  it('test userId getter', () => {
    const userId = faker.string.uuid();
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({ userId }));

    expect(sut.userId).toBeDefined();
    expect(typeof sut.userId).toBe('string');
    expect(sut.userId).toBe(userId);
  });

  it('test createdAt getter', () => {
    const createdAt = new Date();
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({ createdAt }));

    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.createdAt).toBe(createdAt);
  });

  it('test update name method', () => {
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    const newName = faker.string.alphanumeric();

    sut.updateName(newName);

    expect(sut.name).toBe(newName);
    expect(FeatureFlagEntity.validate).toHaveBeenCalledWith({
      ...sut.props,
      name: newName,
    });
  });

  it('test update description method', () => {
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    const newDescription = faker.string.alphanumeric();

    sut.updateDescription(newDescription);

    expect(sut.description).toBe(newDescription);
    expect(FeatureFlagEntity.validate).toHaveBeenCalledWith({
      ...sut.props,
      description: newDescription,
    });
  });

  it('test enable method', () => {
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({ enabled: false }));

    sut.enable();

    expect(sut.enabled).toBe(true);
    expect(FeatureFlagEntity.validate).toHaveBeenCalledWith({
      ...sut.props,
      enabled: true,
    });
  });

  it('test disable method', () => {
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({ enabled: true }));

    sut.disable();

    expect(sut.enabled).toBe(false);
    expect(FeatureFlagEntity.validate).toHaveBeenCalledWith({
      ...sut.props,
      enabled: false,
    });
  });

  it('test update method for multiple properties', () => {
    sut = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    const newName = faker.string.alphanumeric();
    const newDescription = faker.string.alphanumeric();
    const newEnabled = !sut.enabled;

    sut.update(newName, newDescription, newEnabled);

    expect(sut.name).toBe(newName);
    expect(sut.description).toBe(newDescription);
    expect(sut.enabled).toBe(newEnabled);
    expect(FeatureFlagEntity.validate).toHaveBeenCalledWith({
      ...sut.props,
      name: newName,
      description: newDescription,
      enabled: newEnabled,
    });
  });
});
