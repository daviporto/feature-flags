export class AppUserWithIdNotFoundError extends Error {
  constructor(public id: string) {
    super(`appUser having id ${id} not found`);
    this.name = 'AppUserWithIdNotFoundError';
  }
}
