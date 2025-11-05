import { acceptHMRUpdate, defineStore } from "pinia";
import { create, search , deleteFeatureFlag} from "src/api/featureFlagsApi";
import type { CreateFeatureFlagData, FeatureFlag } from "src/types/feature-flag";

export const useFeatureFlagsStore = defineStore('feature-flag', {
    actions: {
        async listFeatureFlags () : Promise<FeatureFlag[]> {
            const result = await search();

            return result;
        },
        async createFeatureFlag (data : CreateFeatureFlagData) : Promise<FeatureFlag> {
            const result = await create(data);

            return result;
        },
        async deleteFeatureFlag (flagId : string) : Promise<void> {
            await deleteFeatureFlag(flagId);
        }
    }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFeatureFlagsStore, import.meta.hot));
}