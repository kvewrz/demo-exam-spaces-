import { createContext, useState } from "react"
import ReviewsApi from "../api/reviews-api"

export const ReviewsContext = createContext(null)
function ReviewsProvider({children}) {
    const [reviews , setReviews] = useState([])
    const [page , setPage] = useState(1)
    const [limit , setLimit] = useState(5)
    const [total , setTotal] = useState(0)
    const [loader , setLoader] = useState(false)
    const  getReviews = async (spaceId , page , limit) => {
        setLoader(true)
        const data = await ReviewsApi.getReviews(spaceId , page , limit)
        setReviews(data.data)
        setPage(page)
        setTotal(data.total)
        setLoader(false)
    }
    const createReviews = async (form) => {
        const data = await ReviewsApi.createReviews(form)
        setReviews(prev => [...prev , data])
        return data
    }
    const manageReviews = async (spaceId , page , limit) => {
        setLoader(true)
        const data = await ReviewsApi.getReviewsManage(spaceId , page , limit)
        setReviews(data.data)
        setPage(page)
        setTotal(data.total)
        setLoader(false)
        return data
    }
    const updateReviews = async (id , isHidden ) => {
        const data = await ReviewsApi.updateReviews(id , isHidden)
        setReviews(prev => prev.map(el => el.id === id ? data: el))
        return data
    }
    const removeReviews = async (id) => {
        const data = await ReviewsApi.removeReviews(id)
        setReviews(prev => prev.filter(el => el.id !== id))
        return data
    }
    const value = {
        getReviews , page , setPage , limit , setLimit, loader, setLoader , reviews , setReviews , total , setTotal  , createReviews , updateReviews , manageReviews , removeReviews
    }
  return (
    <ReviewsContext value={value}>
        {children}
    </ReviewsContext>
  )
}

export default ReviewsProvider
