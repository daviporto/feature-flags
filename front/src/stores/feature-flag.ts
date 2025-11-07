import { acceptHMRUpdate, defineStore } from "pinia";
import { createFeatureFlag, searchFeatureFlag , deleteFeatureFlag, updateFeatureFlag, toggleFeatureFlag} from "src/api/featureFlagsApi";
import type { CreateFeatureFlagData, FeatureFlag, UpdateFeatureFlagData } from "src/types/feature-flag";

export const useFeatureFlagsStore = defineStore('feature-flag', {
    actions: {
        async listFeatureFlags () : Promise<FeatureFlag[]> {
            const result = await searchFeatureFlag();

            return result;
        },
        async create (data : CreateFeatureFlagData) : Promise<FeatureFlag> {
            const result = await createFeatureFlag(data);

            return result;
        },
        async delete (flagId : string) : Promise<void> {
            await deleteFeatureFlag(flagId);
        },
        async update (flagId : string, data : UpdateFeatureFlagData) : Promise<UpdateFeatureFlagData> {
            const result = await updateFeatureFlag(flagId, data);

            return result;    
        },
        async toggle (flagId : string, data : UpdateFeatureFlagData) : Promise<void> {
            await toggleFeatureFlag(flagId, data)
        }
    }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFeatureFlagsStore, import.meta.hot));
}