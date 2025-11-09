import { UserOutput } from '@/user/application/dtos/user-output';
import { UserPresenter } from '@/user/infrastructure/presenters/user.presenter';
import { ApiProperty } from '@nestjs/swagger';

export class LogInUserPresenter extends UserPresenter {
  @ApiProperty({ description: 'The token of the user' })
  token: string;

  @ApiProperty({ description: 'The user api token' })
  api_token: string;

  constructor(output: UserOutput, token: string, api_token: string) {
    super(output);

    this.token = token;
    this.api_token = api_token;
  }
}
