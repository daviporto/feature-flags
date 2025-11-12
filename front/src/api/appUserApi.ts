import { getAxiosWithAuth } from 'src/boot/axios';
import type { AppUser, CreateAppUserData } from 'src/types/app-user';

export const searchAppUsers = async (): Promise<AppUser[]> => {
  const response = await getAxiosWithAuth().get('/app-user');
  
  return response.data.data;
};

export const createAppUser = async (data : CreateAppUserData): Promise<AppUser> => {
  const response = await getAxiosWithAuth().post('/app-user', data);

  return response.data.data;
};