import { acceptHMRUpdate, defineStore } from "pinia";
import { createAppUser, deleteAppUser, searchAppUsers, updateAppUser } from "src/api/appUserApi";
import type { AppUser, CreateAppUserData, UpdateAppUserData } from "src/types/app-user";

export const useAppUserStore = defineStore('app-user', {
    actions: {
        async listAppUsers () : Promise<AppUser[]> {
            const result = await searchAppUsers();

            return result;
        },
        async create (data : CreateAppUserData) : Promise<AppUser> {
            const result = await createAppUser(data);

            return result;
        },
        async delete (appUserId : string) : Promise<void> {
            await deleteAppUser(appUserId);
        },
        async update (appUserId : string, data : UpdateAppUserData) : Promise<UpdateAppUserData> {
            const result = await updateAppUser(appUserId, data);

            return result;    
        },
    }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppUserStore, import.meta.hot));
}