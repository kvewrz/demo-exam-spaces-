import { createContext, useState } from "react"
import BookingsApi from "../api/bookings-api"

export const BookingsContext = createContext(null)
function BookingProvider({children}) {
    const [bookings , setBookings] = useState([])
    const [loader , setLoader] = useState(false)
    const [total , setTotal] = useState(0)
    const [page , setPage] = useState(1)
    const [limit , setLimit] = useState(5)
    const getBookings = async (page , limit , status) => {
        setLoader(true)
        const data = await BookingsApi.getBookings(page , limit , status)
        setBookings(data.data)
        setPage(page)
        setTotal(data.total)
        setLoader(false)
        return data
    }
    const createBooking = async (form) => {
        const data = await BookingsApi.createBooking(form)
        setBookings(prev => [...prev , data])
        return data
    }
    const cancelBooking = async (id) => {
        const data = await BookingsApi.cancelBooking(id)
        setBookings(prev => prev.map(el => el.id === id ? data : el))
        return data
    }
    const statusBooking = async (id , status) => {
        const data = await BookingsApi.statusBooking(id , status)
        setBookings(prev => prev.map(el => el.id === id ? data : el))
        return data
    }
    const value = { 
        getBookings , limit , setLimit, total , setTotal , page , setPage , cancelBooking , statusBooking, bookings , setBookings , createBooking
    }
  return (
    <BookingsContext value={value} >
        {children}
    </BookingsContext>
  )
}

export default BookingProvider
