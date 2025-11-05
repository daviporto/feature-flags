/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropOrFactory } from '@/shared/domain/common';
import { AppUserEntity, AppUserProps } from '../entities/app-user.entity';
import { Faker, faker } from '@faker-js/faker';

export class AppUserFakeBuilder<TBuild = any> {
  private _name: PropOrFactory<string> = (_index) =>
    this.faker.person.fullName();

  private _externalId: PropOrFactory<string> = (_index) =>
    this.faker.string.uuid();

  private _email: PropOrFactory<string> = (_index) =>
    this.faker.internet.email();

  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private _updatedAt: PropOrFactory<Date> | undefined = undefined;

  private countObjs: number;

  private faker: Faker;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.faker = faker;
  }

  static theAppUsers(countObjs: number) {
    return new AppUserFakeBuilder<AppUserEntity[]>(countObjs);
  }

  static aAppUser() {
    return new AppUserFakeBuilder<AppUserEntity>();
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withExternalId(valueOrFactory: PropOrFactory<string>) {
    this._externalId = valueOrFactory;
    return this;
  }

  withEmail(valueOrFactory: PropOrFactory<string>) {
    this._email = valueOrFactory;
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

  build(): TBuild extends AppUserEntity[] ? AppUserEntity[] : AppUserEntity {
    const appUsers = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const props: AppUserProps = {
          name: this.callFactory(this._name, index),
          externalId: this.callFactory(this._externalId, index),
          email: this.callFactory(this._email, index),
          ...(this._createdAt && {
            createdAt: this.callFactory(this._createdAt, index),
          }),
          ...(this._updatedAt && {
            updatedAt: this.callFactory(this._updatedAt, index),
          }),
        };
        return new AppUserEntity(props);
      });

    return (this.countObjs === 1 ? appUsers[0] : appUsers) as any;
  }

  get name() {
    return this.getValue('name');
  }

  get externalId() {
    return this.getValue('externalId');
  }

  get email() {
    return this.getValue('email');
  }

  get createdAt() {
    return this.getValue('createdAt');
  }

  get updatedAt() {
    return this.getValue('updatedAt');
  }

  private getValue(prop: any) {
    const optional = ['createdAt', 'updatedAt'];

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
