import AxiosInstance from "../../../shared/lib/axios-instance"

class AuthApi{
static async register(form){
    const {data} = await AxiosInstance.post(`/auth/register`, form)
    return data
}
static async login(form){
    const {data} = await AxiosInstance.post(`/auth/login`, form)
    return data
}
static async logout(){
    const {data} = await AxiosInstance.post(`/auth/logout`)
    return data
}
}
export default AuthApi