export class FeatureFlagWithIdNotFoundError extends Error {
  constructor(public id: string) {
    super(`Feature flag having id ${id} not found`);
    this.name = 'featureFlagWithIdNotFoundError';
  }
}
