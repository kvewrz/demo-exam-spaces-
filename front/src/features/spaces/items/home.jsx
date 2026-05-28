import { useContext, useEffect } from "react"
import { SpacesContext } from "../provider/spaces-provider"
import { useNavigate } from "react-router"

function Home() {
    const navigate = useNavigate()
    const {spaces , getPopular , limit , setLimit} = useContext(SpacesContext)
    useEffect(() => {
        getPopular(limit)
    }, [limit])
  return (
    <div className="block-items">
        <h1>Home</h1>
        <div className="filter">
            <label>
                limit
                <input type="number" value={limit} onChange={(e) => {
                    const value = e.target.value
                    setLimit(value > 0 ? value : 1)
                }}/>
            </label>
        </div>
      {spaces.map(space => (
        <div key={space.id} className="items">
            <img src={space?.images[0]} alt="не смоглии прогрузить" />
            <h1>Title: {space?.title}</h1>
            <h2>Description: {space?.description}</h2>
            <h2>Zone: {space?.zoneType}</h2>
            <h2>Rating: {space?.rating}</h2>
            <h2>Capacity: {space?.capacity}</h2>
            <h2>Price: {space?.pricePerHour}</h2>
            <button onClick={() => navigate(`/spaces`)}>kо всем</button>
        </div>
      ))}
    </div>
  )
}

export default Home
