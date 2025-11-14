export interface AppUser {
  id: string;
  name: string;
  email: string;
  externalId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAppUserData {
  name: string;
  email: string;
  externalId: string;
}

export interface UpdateAppUserData {
  name: string;
  email: string;
  externalId: string;
}