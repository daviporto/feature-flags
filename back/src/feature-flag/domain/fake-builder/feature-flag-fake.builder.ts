/* eslint-disable @typescript-eslint/no-unused-vars */
import { FeatureFlagEntity } from '../entities/feature-flag.entity';
import { Faker, faker } from '@faker-js/faker';
import { PropOrFactory } from '@/shared/domain/common';

export class FeatureFlagFakeBuilder<TBuild = any> {
  private _name: PropOrFactory<string> = (_index) =>
    this.faker.string.alphanumeric();
  private _description: PropOrFactory<string> = (_index) =>
    this.faker.string.alphanumeric();
  private _enabled: PropOrFactory<boolean> = (_index) =>
    this.faker.datatype.boolean();
  private _userId: PropOrFactory<string> = (_index) => this.faker.string.uuid();
  private _createdAt: PropOrFactory<Date> | undefined = undefined;
  private _updatedAt: PropOrFactory<Date> | undefined = undefined;

  private readonly countObjs: number;

  private faker: Faker;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.faker = faker;
  }

  static theFeatureFlags(countObjs: number) {
    return new FeatureFlagFakeBuilder<FeatureFlagEntity[]>(countObjs);
  }

  static aFeatureFlag() {
    return new FeatureFlagFakeBuilder<FeatureFlagEntity>();
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string>) {
    this._description = valueOrFactory;
    return this;
  }

  withEnabled(valueOrFactory: PropOrFactory<boolean>) {
    this._enabled = valueOrFactory;
    return this;
  }

  withUserId(valueOrFactory: PropOrFactory<string>) {
    this._userId = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  withUpdatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._updatedAt = valueOrFactory;
    return this;
  }

  build(): TBuild extends FeatureFlagEntity[]
    ? FeatureFlagEntity[]
    : FeatureFlagEntity {
    const featureFlags = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const props = {
          name: this.callFactory(this._name, index),
          description: this.callFactory(this._description, index),
          enabled: this.callFactory(this._enabled, index),
          userId: this.callFactory(this._userId, index),
          ...(this._createdAt && {
            createdAt: this.callFactory(this._createdAt, index),
          }),
          ...(this._updatedAt && {
            updatedAt: this.callFactory(this._updatedAt, index),
          }),
        };

        return new FeatureFlagEntity(props);
      });

    return (this.countObjs === 1 ? featureFlags[0] : featureFlags) as any;
  }

  get name() {
    return this.getValue('name');
  }

  get description() {
    return this.getValue('description');
  }

  get enabled() {
    return this.getValue('enabled');
  }

  get userId() {
    return this.getValue('userId');
  }

  get createdAt() {
    return this.getValue('createdAt');
  }

  get updatedAt() {
    return this.getValue('updatedAt');
  }

  private getValue(prop: any) {
    const optional = ['createdAt', 'updatedAt'];
    const required = ['name', 'description', 'enabled', 'userId'];

    const privateProp = `_${prop}` as keyof this;

    if (!this[privateProp] && required.includes(prop)) {
      throw new Error(
        `Property ${prop} does not have a factory, use 'with' methods`,
      );
    }

    if (!this[privateProp] && optional.includes(prop)) {
      return undefined;
    }

    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
