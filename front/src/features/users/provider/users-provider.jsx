import { createContext, useState } from "react"
import UsersApi from "../api/users-api"

export const UsersContext = createContext(null)
function UsersProvider({children}) {
    const [user , setUser] = useState(null)
    const [adminUser , setAdmin] = useState([])
    const [loader , setLoader] = useState(false)
    const [page , setPage] = useState(1)
    const [limit , setLimit] = useState(5)
    const [total , setTotal] = useState(0)
    const getUser = async () => {
        setLoader(true)
        const data = await UsersApi.getUser()
        setUser(data)
        setLoader(false)
        return data
    }
    const updateUser = async (form) => {
        const data = await UsersApi.updateUser(form)
        setUser(data)
        return data
    }
    const getUsers = async (page , limit) => {
        setLoader(true)
        const data = await UsersApi.getUsers(page , limit)
        setAdmin(data.data)
        setPage(page)
        setTotal(data.total)
        setLoader(false)
        return data
    }
    const updateUsers = async (id , isActive) => {
        const data = await UsersApi.updateUsers(id , isActive)
        setAdmin(prev => prev.map(el => el.id === id ? {...el , isActive:data.isActive} : el))
        return data
    }
    const value = {
        user , setUser , adminUser , setAdmin , loader , setLoader , limit , setLimit , total , setTotal, page , setPage , getUser , updateUser , getUsers , updateUsers
    }
  return (
    <UsersContext value={value}>
        {children}
    </UsersContext>
  )
}

export default UsersProvider
