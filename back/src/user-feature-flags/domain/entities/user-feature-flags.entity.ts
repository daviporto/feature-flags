import { Entity } from '@/shared/domain/entities/entity';
import { UserFeatureFlagsValidatorFactory } from '@/user-feature-flags/domain/validators/user-feature-flags.validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-errors';

export type UserFeatureFlagsProps = {
  featureFlagId: string;
  userId: string;
  enabled?: boolean;
};

export class UserFeatureFlagsEntity extends Entity<UserFeatureFlagsProps> {
  constructor(
    public readonly props: UserFeatureFlagsProps,
    id?: string,
  ) {
    UserFeatureFlagsEntity.validate(props);
    super(props, id);
    if (this.props.enabled === undefined) {
      this.props.enabled = true;
    }
  }

  get featureFlagId(): string {
    return this.props.featureFlagId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get enabled(): boolean {
    return this.props.enabled;
  }
  static validate(props: UserFeatureFlagsProps) {
    const validator = UserFeatureFlagsValidatorFactory.create();
    const isValid = validator.validate(props);

    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  updateUserId(userId: string): void {
    UserFeatureFlagsEntity.validate({ ...this.props, userId });
    this.props.userId = userId;
  }

  updateFeatureFlagId(featureFlagId: string): void {
    UserFeatureFlagsEntity.validate({ ...this.props, featureFlagId });
    this.props.featureFlagId = featureFlagId;
  }

  enable(): void {
    UserFeatureFlagsEntity.validate({ ...this.props, enabled: true });
    this.props.enabled = true;
  }

  disable(): void {
    UserFeatureFlagsEntity.validate({ ...this.props, enabled: false });
    this.props.enabled = false;
  }

  update(userId: string, featureFlagId: string, enabled: boolean): void {
    UserFeatureFlagsEntity.validate({
      ...this.props,
      userId,
      featureFlagId,
      enabled,
    });
    this.props.userId = userId;
    this.props.featureFlagId = featureFlagId;
    this.props.enabled = enabled;
  }
}
