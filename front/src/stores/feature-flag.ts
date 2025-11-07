import { acceptHMRUpdate, defineStore } from "pinia";
import { createFeatureFlag, searchFeatureFlag , deleteFeatureFlag, updateFeatureFlagApi} from "src/api/featureFlagsApi";
import type { CreateFeatureFlagData, FeatureFlag, UpdateFeatureFlagData } from "src/types/feature-flag";

export const useFeatureFlagsStore = defineStore('feature-flag', {
    actions: {
        async listFeatureFlags () : Promise<FeatureFlag[]> {
            const result = await searchFeatureFlag();

            return result;
        },
        async createFeatureFlag (data : CreateFeatureFlagData) : Promise<FeatureFlag> {
            const result = await createFeatureFlag(data);

            return result;
        },
        async deleteFeatureFlag (flagId : string) : Promise<void> {
            await deleteFeatureFlag(flagId);
        },
        async updateFeatureFlag (flagId : string, data : UpdateFeatureFlagData) : Promise<UpdateFeatureFlagData> {
            const result = await updateFeatureFlagApi(flagId, data);

            return result;    
        }
    }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFeatureFlagsStore, import.meta.hot));
}