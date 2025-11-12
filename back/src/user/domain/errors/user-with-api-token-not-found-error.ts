export class UserWithApiTokenNotFoundError extends Error {
  constructor(public api_token: string) {
    super(`User with api_token ${api_token} not found`);
    this.name = 'UserWithApiTokenNotFoundError';
  }
}
