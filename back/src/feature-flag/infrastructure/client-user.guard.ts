import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientUserService } from './client-user.service';

@Injectable()
export class ClientUserGuard implements CanActivate {
  constructor(private readonly clientUserService: ClientUserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.query.token;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request.user = await this.clientUserService.findUserByApiToken(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
