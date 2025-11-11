export class UserFeatureFlagAlreadyExistsError extends Error {
  constructor(public featureFlagId: string, public userId: string) {
    super(
      `User feature flag already exists for feature flag ${featureFlagId} and user ${userId}`,
    );
    this.name = 'UserFeatureFlagAlreadyExistsError';
  }
}





