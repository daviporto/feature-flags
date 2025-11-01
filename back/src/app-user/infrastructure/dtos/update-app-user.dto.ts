import { UpdateAppUserUsecase } from '@/app-user/application/usecases/update-app-user.usecase';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppUserDto
  implements Omit<UpdateAppUserUsecase.Input, 'id'>
{
  @ApiProperty({
    description: 'The email of the app user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The name of the app user',
    example: 'new app user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The app user external id',
    example: '4859759348asds',
  })
  @IsNotEmpty()
  @IsString()
  externalId: string;
}
