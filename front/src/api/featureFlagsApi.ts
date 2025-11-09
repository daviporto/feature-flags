import { getAxiosWithAuth } from "src/boot/axios"
import type { CreateFeatureFlagData, FeatureFlag, UpdateFeatureFlagData } from "src/types/feature-flag"

export const searchFeatureFlag = async (userId?: string) : Promise<FeatureFlag[]> => {
    const params: Record<string, unknown> = {}
    if (userId) {
        params.filter = { userId }
    }
    const response = await getAxiosWithAuth().get('/feature-flag', { 
        params,
        paramsSerializer: (params) => {
            const searchParams = new URLSearchParams()
            Object.keys(params).forEach(key => {
                if (key === 'filter' && typeof params[key] === 'object') {
                    Object.keys(params[key]).forEach(filterKey => {
                        searchParams.append(`filter[${filterKey}]`, params[key][filterKey])
                    })
                } else {
                    searchParams.append(key, params[key])
                }
            })
            return searchParams.toString()
        }
    })
    
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