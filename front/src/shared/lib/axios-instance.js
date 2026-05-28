import axios from 'axios'
import AuthStorage from '../../features/auth/models/auth-storage'
const AxiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL || 'http://localhost:3010',
    headers:{
        'Content-Type':'application/json'
    }
}) 
AxiosInstance.interceptors.request.use((config) => {
    const token = AuthStorage.getAccessToken()
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})
AxiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config
        const isRefreshing = originalRequest.url.includes('/auth/refresh')
        if(isRefreshing){
            AuthStorage.clear()
            throw error
        }
        if(error?.response?.status !== 401){
            throw error
        }
        try{
            const refreshToken = AuthStorage.getRefreshToken()
            if(!refreshToken){
                throw error
            }
            const {data} = await axios.post(`http://localhost:3010/auth/refresh`, {refreshToken})
            if(data?.accessToken){
                AuthStorage.setAccessToken(data.accessToken)
                AxiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
            }
            return AxiosInstance(originalRequest)
        }catch(error){
            AuthStorage.clear()
            throw error 
        }
    }
)
export default AxiosInstance