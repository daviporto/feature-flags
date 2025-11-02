export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};
