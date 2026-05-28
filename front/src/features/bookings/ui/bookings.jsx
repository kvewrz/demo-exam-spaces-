import { useContext, useEffect } from "react"
import { BookingsContext } from "../provider/bookings-provider"
import { ToastContext } from "../../../widgets/toast/toast-provider"
import { AuthContext } from "../../auth/provider/auth-provider"

function Bookings() {
  const {showToast} = useContext(ToastContext)
  const {user} = useContext(AuthContext)
    const {bookings , getBookings, cancelBooking , statusBooking , setPage , page , total , limit , setLimit,} = useContext(BookingsContext)
    useEffect(() => {
        getBookings(page, limit)
    }, [page , limit])
    const maxPage = Math.ceil(total / limit)
    const nextPage = Array.from({length:maxPage}, (_,i) => i + 1)
    const onCancel = async (id) => {
      try{
        const data = await cancelBooking(id)
        showToast('удачно отменили', 'success')
        return data
      }catch(error){
        showToast(error?.response?.data?.error , 'error')
      }
    }
    const onStatus = async (id , status) => {
      try{
        const data = await statusBooking(id ,status)
        showToast('удачно выбрали решение о заказе', 'success')
        console.log(data)
      }catch(error){
        showToast(error?.response?.data?.error , 'error')
      }
    }
  return (
    <div>
        <h1>Bookings</h1>
        <div className="filter">
          <label>
            Limit
            <input type="number" value={limit} onChange={(e) => {
              const value = e.target.value
              setLimit(value > 0 ? value : 1)
            }} />
          </label>
        </div>
      <div className="block-items">
        {bookings.map(booking => (
            <div className="items">
                <h1>Name:{booking?.User?.name}</h1>
                <h2>Space title: {booking?.Space?.title}</h2>
                <h2>Space price: {booking?.Space?.pricePerHour}</h2>
                <h2>Space zone: {booking?.Space?.zoneType}</h2>
                <h2>Space capacity: {booking?.Space?.capacity}</h2>
                <h2>Comment: {booking?.comment}</h2>
                <h2>Date: {booking?.date}</h2>
                <h2>TimeFrom: {booking?.timeFrom}</h2>
                <h2>TimeTo: {booking?.timeTo}</h2>
                <h2>Status: {booking?.status}</h2>
                {booking.status === 'pending' && (
                  <>
                  {(user?.role === 'client' || user?.role === 'manager')  && (
                  <>
                  <button onClick={() => onCancel(booking.id)}>Отменить</button>
                  </>
                )}
                  </>
                )}
                
                {user?.role === 'admin' && (
                  <>
                  {booking.status === 'pending' && (
                    <> 
                    <button onClick={() => onStatus(booking.id , 'approved')}>Согласовать</button>
                  <button onClick={() => onStatus(booking.id, 'rejected')}>Отказать</button>
                    </>
                  )}
                  </>
                )}
            </div>
        ))}
      </div>
      <div className="block-page">
        <button onClick={() => setPage(prev => prev - 1)} disabled={page === 1}>Back</button>
        {nextPage.map(next => (
          <button className={page === next ? 'active' : ''} key={next} onClick={() => setPage(next)}>{next}</button>
        ))}
        <button onClick={() => setPage(prev =>prev + 1)} disabled={page === maxPage}>Next</button>
      </div>
    </div>
  )
}

export default Bookings
