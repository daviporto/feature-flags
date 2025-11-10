import type { SignInData, SignupData, UpdatePasswordData, User } from 'src/types/auth';
import { api, getAxiosWithAuth } from 'boot/axios';

export const signup = async (data: SignupData): Promise<User> => {
  const response = await api.post('/user', data);

  return response.data.data;
};

export const signIn = async (data: SignInData): Promise<User> => {
  const response = await api.post('/user/login', data);

  return response.data.data;
};

export const verifyToken = async (token: string): Promise<User | null> => {
  const response = await api.post('/user/verifyToken', {
    token,
  });

  const userId = response.data.data.id;

  if (!userId) {
    return null;
  }

  const user = await api.get(`/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!user) {
    return null;
  }

  return {
    ...user.data.data,
    token,
  };
};

export const updatePassword = async (data: UpdatePasswordData, userId: string): Promise<void> => {
  await getAxiosWithAuth().patch(`/user/${userId}/password`, data);
};

export const updateName = async (data: { name: string }, userId: string): Promise<User> => {
  const response = await getAxiosWithAuth().put(`/user/${userId}`, data);

  return response.data.data;
};
