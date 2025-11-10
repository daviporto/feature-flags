/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropOrFactory } from '@/shared/domain/common';
import { UserFeatureFlagsEntity } from '../entities/user-feature-flags.entity';
import { Faker, faker } from '@faker-js/faker';

export class UserFeatureFlagsFakeBuilder<TBuild = any> {
  private _featureFlagId: PropOrFactory<string> = (_index) =>
    this.faker.string.uuid();

  private _userId: PropOrFactory<string> = (_index) => this.faker.string.uuid();

  private _enabled: PropOrFactory<boolean> = (_index) => true;

  private countObjs: number;

  private faker: Faker;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.faker = faker;
  }

  static theUserFeatureFlags(countObjs: number) {
    return new UserFeatureFlagsFakeBuilder<UserFeatureFlagsEntity[]>(countObjs);
  }

  static aUserFeatureFlags() {
    return new UserFeatureFlagsFakeBuilder<UserFeatureFlagsEntity>();
  }

  withFeatureFlagId(valueOrFactory: PropOrFactory<string>) {
    this._featureFlagId = valueOrFactory;
    return this;
  }

  withUserId(valueOrFactory: PropOrFactory<string>) {
    this._userId = valueOrFactory;
    return this;
  }

  withEnabled(valueOrFactory: PropOrFactory<boolean>) {
    this._enabled = valueOrFactory;
    return this;
  }

  build(): TBuild extends UserFeatureFlagsEntity[]
    ? UserFeatureFlagsEntity[]
    : UserFeatureFlagsEntity {
    const userFeatureFlagss = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        return new UserFeatureFlagsEntity({
          featureFlagId: this.callFactory(this._featureFlagId, index),
          userId: this.callFactory(this._userId, index),
          enabled: this.callFactory(this._enabled, index),
        });
      });

    return (
      this.countObjs === 1 ? userFeatureFlagss[0] : userFeatureFlagss
    ) as any;
  }

  get featureFlagId() {
    return this.getValue('featureFlagId');
  }

  get userId() {
    return this.getValue('userId');
  }

  get enabled() {
    return this.getValue('enabled');
  }

  private getValue(prop: any) {
    const optional: string[] = [];

    const privateProp = `_${prop}` as keyof this;

    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} does not have a factory, use 'with' methods`,
      );
    }

    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
