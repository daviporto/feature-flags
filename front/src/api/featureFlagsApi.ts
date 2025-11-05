//post - create
//get - search
//put - update

import { getAxiosWithAuth } from "src/boot/axios"
import type { CreateFeatureFlagData, FeatureFlag } from "src/types/feature-flag"

export const search = async () : Promise<FeatureFlag[]> => {
    const response = await getAxiosWithAuth().get('/feature-flag')
    
    return response.data.data
}

export const create = async (data : CreateFeatureFlagData) : Promise<FeatureFlag> => {
    const response = await getAxiosWithAuth().post('/feature-flag', data)

    return response.data.data
}

export const deleteFeatureFlag = async (flagId : string) : Promise<void> => {
    await getAxiosWithAuth().delete(`/feature-flag/${flagId}`)
}