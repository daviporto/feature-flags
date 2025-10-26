import { Entity } from '@/shared/domain/entities/entity';
import { FeatureFlagValidatorFactory } from '@/feature-flag/domain/validators/feature-flag.validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-errors';

export type FeatureFlagProps = {
  name: string;
  description: string;
  enabled: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FeatureFlagEntity extends Entity<FeatureFlagProps> {
  constructor(
    public readonly props: FeatureFlagProps,
    id?: string,
  ) {
    FeatureFlagEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get enabled(): boolean {
    return this.props.enabled;
  }

  get userId(): string {
    return this.props.userId;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static validate(props: FeatureFlagProps) {
    const validator = FeatureFlagValidatorFactory.create();
    const isValid = validator.validate(props);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  updateName(name: string): void {
    FeatureFlagEntity.validate({ ...this.props, name });
    this.props.name = name;
    this.setUpdatedAt();
  }

  updateDescription(description: string): void {
    FeatureFlagEntity.validate({ ...this.props, description });
    this.props.description = description;
    this.setUpdatedAt();
  }

  enable(): void {
    FeatureFlagEntity.validate({ ...this.props, enabled: true });
    this.props.enabled = true;
    this.setUpdatedAt();
  }

  disable(): void {
    FeatureFlagEntity.validate({ ...this.props, enabled: false });
    this.props.enabled = false;
    this.setUpdatedAt();
  }

  update(name: string, description: string, enabled: boolean): void {
    FeatureFlagEntity.validate({ ...this.props, name, description, enabled });
    this.props.name = name;
    this.props.description = description;
    this.props.enabled = enabled;
    this.setUpdatedAt();
  }

  private setUpdatedAt(): void {
    this.props.updatedAt = new Date();
  }
}
