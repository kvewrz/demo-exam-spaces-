import { createContext, useEffect, useState } from "react"
import AuthStorage from "../models/auth-storage"
import AuthApi from "../api/auth-api"

export const AuthContext = createContext(null)
function AuthProvider({children}) {
    const [user , setUser] = useState(null)
    const [loader , setLoader] = useState(true)
    useEffect(() => {
        const userLocal = AuthStorage.getUserStorage()
        if(userLocal){
            setUser(userLocal)
        }
        setLoader(false)
    }, [])
    const register = async (form) => {
        setLoader(true)
        const data = await AuthApi.register(form)
        setLoader(false)
        return data
    }
    const login = async (form) => {
        setLoader(true)
        const data = await AuthApi.login(form)
        setUser(data.user)
        AuthStorage.setAccessToken(data.accessToken)
        AuthStorage.setRefreshToken(data.refreshToken)
        AuthStorage.setUserStorage(data.user)
        setLoader(false)
        return data
    }
    const logout = async () => {
        setLoader(true)
        const data = await AuthApi.logout()
        AuthStorage.clear()
        setUser(null)
        setLoader(false)
        return data
    }
    const value = {
        user , setUser , loader , setLoader , register , login , logout
    }
  return (
    <AuthContext value={value} >
        {children}
    </AuthContext>
  )
}

export default AuthProvider
