export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFeatureFlagData {
  name: string;
  description: string;
  enabled: boolean;
}

export interface UpdateFeatureFlagData {
  name: string;
  description: string;
  enabled: boolean;
}