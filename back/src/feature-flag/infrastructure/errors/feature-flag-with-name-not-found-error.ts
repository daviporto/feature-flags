export class FeatureFlagWithNameNotFoundError extends Error {
  constructor(public name: string) {
    super(`Feature flag having name ${name} not found`);
    this.name = 'FeatureFlagWithNameNotFoundError';
  }
}
