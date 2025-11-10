export interface CreateUserFeatureFlagData {
  featureFlagId: string;
  userId: string;
  enabled?: boolean;
}

export interface UserFeatureFlag {
  id: string;
  featureFlagId: string;
  userId: string;
  enabled: boolean;
}

