import { createContext, useState } from "react"
import SpacesApi from "../api/spaces-api"

export const SpacesContext = createContext(null)
function SpacesProvider({children}) {
    const [spaces , setSpaces] = useState([])
    const [loader , setLoader] = useState(false)
    const [page , setPage] = useState(1)
    const [total , setTotal] = useState(0)
    const [limit , setLimit] = useState(5)
    const [filters , setFilters] = useState({
        zoneType:'',
        minPrice:'',
        maxPrice:'',
        minCapacity:"",
        sort:""
    })
    const getPopular = async (limit) => {
        setLoader(true)
        const data = await SpacesApi.getPopular(limit)
        setSpaces(data)
        setLoader(false)
        return data
    }
    const getSpaces = async (page , limit , filters) => {
        setLoader(true)
        const data = await SpacesApi.getSpaces(page , limit , filters)
        setSpaces(data.data)
        setPage(page)
        setTotal(data.total)
        setFilters(filters)
        setLoader(false)
        return data
    }
    const remove = async (id) => {
        const data = await SpacesApi.removeSpaces(id)
        setSpaces(prev => prev.filter(el => el.id !== id))
        return data
    }
    const create = async (form) => {
        const data = await SpacesApi.createSpaces(form)
        setSpaces(prev => [...prev , form])
        return data
    }
    const update = async (id , form) => {
        const data = await SpacesApi.updateSpaces(id , form)
        setSpaces(prev => prev.map(el => el.id === id ? data : el))
        return data
    }
    const value = {
        getPopular , limit , setLimit , loader , setLoader, spaces , getSpaces , filters , setFilters , total , setTotal , page , setPage , remove , create , update
    }
  return (
    <SpacesContext value={value}>
        {children}
    </SpacesContext>
  )
}

export default SpacesProvider
