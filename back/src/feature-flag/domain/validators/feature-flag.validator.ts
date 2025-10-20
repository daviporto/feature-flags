import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ClassValidatorFields } from '@/shared/domain/entities/validators/class-validator-fields';
import { FeatureFlagProps } from '@/feature-flag/domain/entities/feature-flag.entity';

class FeatureFlagRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  enabled: boolean;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;
  constructor(data: FeatureFlagProps) {
    Object.assign(this, data);
  }
}

export class FeatureFlagValidator extends ClassValidatorFields<FeatureFlagRules> {
  validate(data: FeatureFlagProps): boolean {
    return super.validate(new FeatureFlagRules(data));
  }
}

export class FeatureFlagValidatorFactory {
  static create(): FeatureFlagValidator {
    return new FeatureFlagValidator();
  }
}
