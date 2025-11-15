import { getAxiosWithAuth } from 'src/boot/axios';
import type {
  CreateUserFeatureFlagData,
  UserFeatureFlag,
} from 'src/types/user-feature-flag';

export const createUserFeatureFlag = async (
  data: CreateUserFeatureFlagData,
): Promise<void> => {
  await getAxiosWithAuth().post('/user-feature-flags', data);
};

export const listUserFeatureFlags = async (
  featureFlagId?: string,
): Promise<UserFeatureFlag[]> => {
  const params: Record<string, unknown> = {};
  if (featureFlagId) {
    params.filter = { featureFlagId };
  }
  const response = await getAxiosWithAuth().get('/user-feature-flags', {
    params,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (key === 'filter' && typeof params[key] === 'object') {
          Object.keys(params[key]).forEach((filterKey) => {
            searchParams.append(
              `filter[${filterKey}]`,
              params[key][filterKey],
            );
          });
        } else {
          searchParams.append(key, params[key]);
        }
      });
      return searchParams.toString();
    },
  });

  return response.data.data;
};

export const deleteUserFeatureFlag = async (id: string): Promise<void> => {
  await getAxiosWithAuth().delete(`/user-feature-flags/${id}`);
};

export const updateUserFeatureFlag = async (id: string, data : CreateUserFeatureFlagData) : Promise<void> => {
  await getAxiosWithAuth().put(`/user-feature-flags/${id}`, data);
};