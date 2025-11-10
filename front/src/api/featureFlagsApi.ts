import { getAxiosWithAuth } from "src/boot/axios"
import type { CreateFeatureFlagData, FeatureFlag, UpdateFeatureFlagData } from "src/types/feature-flag"

export const searchFeatureFlag = async (name? : string) : Promise<FeatureFlag[]> => {
    const url = new URL(process.env.VITE_API_URL ?? 'http://localhost:3000');
    const paramsUrl = new URLSearchParams(url.search);

    if (name) {
        paramsUrl.set('filter[name]', name.trim())
    }

    const response = await getAxiosWithAuth().get(`/feature-flag?${paramsUrl.toString()}`)
    
    return response.data.data
}

export const createFeatureFlag = async (data : CreateFeatureFlagData) : Promise<FeatureFlag> => {
    const response = await getAxiosWithAuth().post('/feature-flag', data)

    return response.data.data
}

export const deleteFeatureFlag = async (flagId : string) : Promise<void> => {
    await getAxiosWithAuth().delete(`/feature-flag/${flagId}`)
}

export const updateFeatureFlag = async (flagId : string, data : UpdateFeatureFlagData) : Promise<UpdateFeatureFlagData> => {
    const response = await getAxiosWithAuth().put(`/feature-flag/${flagId}`, data)

    return response.data
}

export const toggleFeatureFlag = async (flagId : string, data : UpdateFeatureFlagData) : Promise<void> => {
    await getAxiosWithAuth().put(`/feature-flag/${flagId}`, data)
}