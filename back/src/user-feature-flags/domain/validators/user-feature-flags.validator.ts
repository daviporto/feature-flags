import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ClassValidatorFields } from '@/shared/domain/entities/validators/class-validator-fields';
import { UserFeatureFlagsProps } from '@/user-feature-flags/domain/entities/user-feature-flags.entity';

class UserFeatureFlagsRules {
  @IsUUID()
  @IsNotEmpty()
  featureFlagId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsBoolean()
  enabled: boolean;

  constructor(data: UserFeatureFlagsProps) {
    Object.assign(this, data);
  }
}

export class UserFeatureFlagsValidator extends ClassValidatorFields<UserFeatureFlagsRules> {
  validate(data: UserFeatureFlagsProps): boolean {
    return super.validate(new UserFeatureFlagsRules(data));
  }
}

export class UserFeatureFlagsValidatorFactory {
  static create(): UserFeatureFlagsValidator {
    return new UserFeatureFlagsValidator();
  }
}
