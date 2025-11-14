import { getAxiosWithAuth } from 'src/boot/axios';
import type { AppUser, CreateAppUserData, UpdateAppUserData } from 'src/types/app-user';

export const searchAppUsers = async (): Promise<AppUser[]> => {
  const response = await getAxiosWithAuth().get('/app-user');
  
  return response.data.data;
};

export const createAppUser = async (data : CreateAppUserData): Promise<AppUser> => {
  const response = await getAxiosWithAuth().post('/app-user', data);

  return response.data.data;
};

export const deleteAppUser = async (appUserId : string) : Promise<void> => {
  await getAxiosWithAuth().delete(`/app-user/${appUserId}`);
};

export const updateAppUser = async (appUserId : string, data : UpdateAppUserData): Promise<UpdateAppUserData> => {
  const response = await getAxiosWithAuth().put(`/app-user/${appUserId}`, data);

  return response.data.data;
}