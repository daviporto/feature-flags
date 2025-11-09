import { getAxiosWithAuth } from 'src/boot/axios';
import type { AppUser } from 'src/types/app-user';

export const listAppUsers = async (): Promise<AppUser[]> => {
  const response = await getAxiosWithAuth().get('/app-user');
  
  return response.data.data;
};

