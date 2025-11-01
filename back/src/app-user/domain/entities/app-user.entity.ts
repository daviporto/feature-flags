import { Entity } from '@/shared/domain/entities/entity';
import { AppUserValidatorFactory } from '@/app-user/domain/validators/app-user.validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-errors';

export type AppUserProps = {
  createdAt?: Date;
  updatedAt?: Date;
  externalId: string;
  email: string;
  name: string;
};

export class AppUserEntity extends Entity<AppUserProps> {
  constructor(
    public readonly props: AppUserProps,
    id?: string,
  ) {
    AppUserEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static validate(props: AppUserProps) {
    const validator = AppUserValidatorFactory.create();
    const isValid = validator.validate(props);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  get externalId(): string {
    return this.props.externalId;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  update(externalId: string, email: string, name: string): void {
    AppUserEntity.validate({ ...this.props, externalId, email, name });
    this.props.externalId = externalId;
    this.props.email = email;
    this.props.name = name;
    this.setUpdatedAt();
  }

  private setUpdatedAt(): void {
    this.props.updatedAt = new Date();
  }
}
