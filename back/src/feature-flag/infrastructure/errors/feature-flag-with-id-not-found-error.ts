export class FeatureFlagWithIdNotFoundError extends Error {
  constructor(public id: string) {
    super(`feature-flag having id ${id} not found`);
    this.name = 'feature-flagWithIdNotFoundError';
  }
}
