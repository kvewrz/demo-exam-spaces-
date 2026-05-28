import AxiosInstance from "../../../shared/lib/axios-instance"

class UsersApi{
static async getUser(){
    const {data} = await AxiosInstance.get('/users/me')
    return data
}
static async updateUser(form){
    const {data} = await AxiosInstance.patch(`/users/me`, form)
    return data
}
static async getUsers(page , limit){
    const {data} = await AxiosInstance.get(`/users`, {
        params:{
            page,
            limit 
        }
    })
    return data
}
static async updateUsers(id, isActive){
    const {data} = await AxiosInstance.patch(`/users/${id}`, {isActive})
    return data
}
}
export default UsersApi