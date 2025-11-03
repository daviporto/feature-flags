export class AppUserWithIdNotFoundError extends Error {
  constructor(public id: string) {
    super(`App User having id ${id} not found`);
    this.name = 'AppUserWithIdNotFoundError';
  }
}
