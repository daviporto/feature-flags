import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAppUserUsecase } from '@/app-user/application/usecases/create-app-user.usecase';

export class CreateAppUserDto
  implements CreateAppUserUsecase.Input {
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

  @ApiProperty({
    description: 'The external id of the app user',
    example: 'randomId',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  externalId: string;
}
