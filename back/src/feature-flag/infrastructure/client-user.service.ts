import { UserRepository } from '@/user/domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ClientUserService {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository.Repository,
  ) {}

  async findUserByApiToken(api_token: string) {
    return this.userRepository.findByApiToken(api_token);
  }
}
