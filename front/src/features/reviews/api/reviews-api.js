import AxiosInstance from "../../../shared/lib/axios-instance"

class ReviewsApi{
static async getReviews(spaceId , page , limit){
    const {data} = await AxiosInstance.get(`/reviews`, {
        params:{
            spaceId,
            page,
            limit
        }
    })
    return data
}
static async getReviewsManage(spaceId , page , limit){
    const {data} = await AxiosInstance.get(`/reviews/manage`,{
        params:{
            spaceId,
            page,
            limit
        }
    })
    return data
}
static async removeReviews(id){
    const {data} = await AxiosInstance.delete(`/reviews/${id}`)
    return data
}
static async createReviews(form){
    const {data} = await AxiosInstance.post(`/reviews`, form)
    return data
}
static async updateReviews(id , isHidden){
    const {data} = await AxiosInstance.patch(`/reviews/${id}`, {isHidden})
    return data
}
}
export default ReviewsApi