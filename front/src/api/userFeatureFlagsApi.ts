import { getAxiosWithAuth } from 'src/boot/axios';
import type { CreateUserFeatureFlagData } from 'src/types/user-feature-flag';

export const createUserFeatureFlag = async (
  data: CreateUserFeatureFlagData,
): Promise<void> => {
  await getAxiosWithAuth().post('/user-feature-flags', data);
};

