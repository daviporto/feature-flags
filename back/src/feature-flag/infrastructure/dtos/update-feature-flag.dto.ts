import { UpdateFeatureFlagUsecase } from '@/feature-flag/application/usecases/update-feature-flag.usecase';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeatureFlagDto implements Omit<UpdateFeatureFlagUsecase.Input, 'id'> {
  @ApiProperty({ description: 'The name of the feature-flag' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
