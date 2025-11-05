import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAppUserUsecase } from '@/app-user/application/usecases/create-app-user.usecase';
import { IsUUID } from 'class-validator';

export class CreateAppUserDto implements CreateAppUserUsecase.Input {
  @ApiProperty({
    description: 'The name of the app user',
    example: 'Alan Turing',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the app user',
    example: 'example@email.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  externalId: string;
}
