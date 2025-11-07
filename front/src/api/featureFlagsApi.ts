//post - create
//get - search
//put - update

import { getAxiosWithAuth } from "src/boot/axios"
import type { CreateFeatureFlagData, FeatureFlag, UpdateFeatureFlagData } from "src/types/feature-flag"

export const searchFeatureFlag = async () : Promise<FeatureFlag[]> => {
    const response = await getAxiosWithAuth().get('/feature-flag')
    
    return response.data.data
}

export const createFeatureFlag = async (data : CreateFeatureFlagData) : Promise<FeatureFlag> => {
    const response = await getAxiosWithAuth().post('/feature-flag', data)

    return response.data.data
}

export const deleteFeatureFlag = async (flagId : string) : Promise<void> => {
    await getAxiosWithAuth().delete(`/feature-flag/${flagId}`)
}

export const updateFeatureFlagApi = async (flagId : string, data : UpdateFeatureFlagData) : Promise<UpdateFeatureFlagData> => {
    const response = await getAxiosWithAuth().put(`/feature-flag/${flagId}`, data)

    return response.data
}