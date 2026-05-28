import AxiosInstance from "../../../shared/lib/axios-instance"

class BookingsApi{
static async getBookings(page, limit , status){
    const {data} = await AxiosInstance.get(`/bookings`,{
        params:{
            page,
            limit,
            status
        }
    })
    return data
}
static async createBooking(form){
    const {data} = await AxiosInstance.post(`/bookings`, form)
    return data
}
static async cancelBooking(id){
    const {data} = await AxiosInstance.patch(`/bookings/${id}/cancel`)
    return data
}
static async statusBooking(id, status){
    const {data} = await AxiosInstance.patch(`/bookings/${id}/status`, {status})
    return data
}
}
export default BookingsApi