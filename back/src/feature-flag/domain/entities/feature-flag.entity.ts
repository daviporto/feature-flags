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

  static validate(props: FeatureFlagProps) {
    const validator = FeatureFlagValidatorFactory.create();
    const isValid = validator.validate(props);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
