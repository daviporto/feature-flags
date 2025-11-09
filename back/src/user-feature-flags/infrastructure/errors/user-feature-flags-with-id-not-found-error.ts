export class UserFeatureFlagsWithIdNotFoundError extends Error {
  constructor(public id: string) {
    super(`user-feature-flags having id ${id} not found`);
    this.name = 'user-feature-flagsWithIdNotFoundError';
  }
}
