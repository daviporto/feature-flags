import { acceptHMRUpdate, defineStore } from "pinia";
import { createUserFeatureFlag, deleteUserFeatureFlag, listUserFeatureFlags, updateUserFeatureFlag } from "src/api/userFeatureFlagsApi";
import type { CreateUserFeatureFlagData, UserFeatureFlag } from "src/types/user-feature-flag";

export const useUserFeatureFlagStore = defineStore('user-feature-flags', {
    actions: {
        async search(featureFlagId?: string) : Promise<UserFeatureFlag[]> {
            const result = await listUserFeatureFlags(featureFlagId);

            return result;
        },
        async create(data : CreateUserFeatureFlagData) : Promise<void> {
            await createUserFeatureFlag(data);
        },
        async delete(flagId : string) : Promise<void> {
            await deleteUserFeatureFlag(flagId);
        },
        async update(flagId : string, data : UserFeatureFlag) : Promise<void> {
            await updateUserFeatureFlag(flagId, data);
         
        },
        async toggle(flagId : string, data : UserFeatureFlag) : Promise<void> {
            await updateUserFeatureFlag(flagId, data)
        }
    }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserFeatureFlagStore, import.meta.hot));
}