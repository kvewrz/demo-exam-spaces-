import { data } from "react-router"
import AxiosInstance from "../../../shared/lib/axios-instance"

class SpacesApi{
static async getPopular(limit){
    const {data} = await AxiosInstance.get(`/spaces/popular`, {
        params:{
            limit
        }
    })
    return data
}
static async getSpaces(page , limit , filters ={}){
const {data} = await AxiosInstance.get(`/spaces`, {
    params:{
        page,
        limit,
        ...filters
    }
})
return data
}
static async getSpacesId(id){
    const {data} = await AxiosInstance.get(`/spaces/${id}`)
    return data
}
static async removeSpaces(id){
    const {data} = await AxiosInstance.delete(`/spaces/${id}`)
    return data
}
static async createSpaces(form){
    const {data} = await AxiosInstance.post(`/spaces`, form)
    return data
 }
static async updateSpaces(id , form){
    const {data} = await AxiosInstance.put(`/spaces/${id}`, form)
    return data
}
}
export default SpacesApi