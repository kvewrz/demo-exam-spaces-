import { useContext, useEffect } from "react"
import { SpacesContext } from "../provider/spaces-provider"
import SpaceItems from "./space-items"
import { AuthContext } from "../../auth/provider/auth-provider"
import SpacesCreate from "./form/spaces-create"


function Space() {
    const {user} = useContext(AuthContext)
    const {spaces , getSpaces , limit , setLimit , total , page , setPage, filters , setFilters} = useContext(SpacesContext)
    useEffect(() => {
        const clearFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !==  '')
        )
        getSpaces(page , limit , filters)
    }, [page , limit , filters])
    const onFilters = (e) => {
        const {value , name} = e.target
        setFilters(prev => ({...prev , [name]:value}))
    }
    const maxPage = Math.ceil(total / limit) 
    const nextPage = Array.from({length:maxPage}, (_, i) => i + 1) 
    const manager = user?.role === 'manager'
  return ( 
    <div className="block-items">
        <h1>Spaces</h1>
        <div>
            <SpacesCreate />
        </div>
        <div className="filter">
            <label>
                limit
                <input type="number" value={limit} onChange={(e) => {
                    const value = e.target.value
                    setLimit(value > 0 ? value:1)
                }} />
            </label>
            <label>
                Zone
                <select name="zoneType" value={filters.zoneType} onChange={onFilters}>
                    <option value="">Все</option>
                    <option value="open-space">open-space</option>
                    <option value="meeting-room">meeting-room</option>
                    <option value="private-office">private-office</option>
                </select>
            </label>
            <label>
                max price
                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={onFilters} />
            </label>
            <label>
                min price
                <input type="number" name="minPrice" value={filters.minPrice} onChange={onFilters} />
            </label>
            <label>
                min capacity
                <input type="number" name="minCapacity" value={filters.minCapacity} onChange={onFilters} />
            </label>
            <label>
                sort
                <select name="sort" value={filters.sort} onChange={onFilters}>
                    <option value="">Все</option>
                    <option value="price_asc">price_asc</option>
                    <option value="price_desc">price_desc</option>
                    <option value="rating_desc">rating_desc</option>
                    <option value="id_asc">id_asc</option>
                </select>
            </label>
        </div>
        <div className="grid">
            {spaces.map(space => (
                <SpaceItems key={space.id} space={space} />
            ))}
        </div>
        <div className="block-page">
            <button  onClick={() => setPage(prev => prev - 1)} disabled={page === 1}>Back</button>
            {nextPage.map(next => (
                <button className={page === next ? 'active' : ''} key={next} onClick={() => setPage(next)}>{next}</button>
            ))}
            <button  onClick={() => setPage(prev => prev + 1)} disabled={page === maxPage}>Next</button>
        </div>
    </div>
  )
}

export default Space
