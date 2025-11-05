import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ClassValidatorFields } from '@/shared/domain/entities/validators/class-validator-fields';
import { AppUserProps } from '@/app-user/domain/entities/app-user.entity';

class AppUserRules {
  @IsOptional()
  @IsDate()
  createdAt: Date;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(255)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  externalId: string;

  constructor(data: AppUserProps) {
    Object.assign(this, data);
  }
}

export class AppUserValidator extends ClassValidatorFields<AppUserRules> {
  validate(data: AppUserProps): boolean {
    return super.validate(new AppUserRules(data));
  }
}

export class AppUserValidatorFactory {
  static create(): AppUserValidator {
    return new AppUserValidator();
  }
}
