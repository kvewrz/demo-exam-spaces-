import { useContext, useEffect, useState } from "react"
import { SpacesContext } from "../provider/spaces-provider"
import Loader from "../../../widgets/loader/loader"
import SpacesApi from "../api/spaces-api"
import { useNavigate, useParams } from "react-router"
import { BookingsContext } from "../../bookings/provider/bookings-provider"
import { ToastContext } from "../../../widgets/toast/toast-provider"
import  * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
const schema = yup.object({
  date:yup.string().min(1, ' минимум 1').required('поле обязательно'),
  timeFrom:yup.string().min(1, ' минимум 1').required('поле обязательно'),
  timeTo:yup.string().min(1, ' минимум 1').required('поле обязательно'),
  comment:yup.string().min(1, ' минимум 1').required('поле обязательно'),
  
})
function SpaceId() {
  const {showToast} = useContext(ToastContext)
  const {createBooking} = useContext(BookingsContext)
  const [show, setShow] = useState(false)
    const [space , setSpace] = useState(null)
    const {loader} = useContext(SpacesContext)
    const {id} = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        const load = async () => {
            const data = await SpacesApi.getSpacesId(id)
            setSpace(data)
        };
        load()
    }, [id])
    const {register, handleSubmit , formState:{errors}, reset} = useForm({
      resolver:yupResolver(schema)
    })
    const onCreate = async (form) => {
      try{
        const data = await createBooking({
          spaceId:Number(id),
          ...form
        })
        showToast('удачно заброниловали', 'success')
        reset()
        setShow(false)
        return data
      }catch(error){
        showToast(error?.response?.data?.error , 'error')
      }
    }
    if(loader){
        return <Loader />
    }
  return (
    <div className="block-items">
      {space && (
        <div className="items">
   <img src={space?.images[0]} alt="пока не прогрузилось" />
      <h1>Title: {space?.title}</h1>
      <h2>Description: {space?.description}</h2>
      <h2>Zone: {space?.zoneType}</h2>
      <h2>Rating: {space?.rating}</h2>
      <h2>Capacity: {space?.capacity}</h2>
      <h2>Price: {space?.pricePerHour}</h2>
      <button onClick={() => navigate(`/spaces`)}>Назад</button>
      <button onClick={() => navigate(`/reviews/${space.id}`)}>К отзывам</button>
      <button onClick={() => setShow(true)}>Забронить</button>
      <div className="block-form">
 {show && (
        <>
        <form onSubmit={handleSubmit(onCreate)} className="form">
         <label>
            Comment
            {errors?.comment && <span className='error-message'>{errors?.comment?.message}</span>}
            <input type="text" className={errors?.comment ? 'error-input' : ''} {...register('comment')}/>
        </label>
         <label>
            Date 
            {errors?.date && <span className='error-message'>{errors?.date?.message}</span>}
            <input type="text" className={errors?.comment ? 'error-input' : ''} {...register('date')}/>
        </label>
         <label>
           timeFrom
            {errors?.timeFrom && <span className='error-message'>{errors?.timeFrom?.message}</span>}
            <input type="text" className={errors?.timeFrom ? 'error-input' : ''} {...register('timeFrom')}/>
        </label>
         <label>
            timeTo 
            {errors?.timeTo && <span className='error-message'>{errors?.timeTo?.message}</span>}
            <input type="text" className={errors?.timeTo ? 'error-input' : ''} {...register('timeTo')}/>
        </label>
        <button>Забронировать</button>
       </form>
        </>
      )}
      </div>
        </div>
      )}
    </div>
  )
}

export default SpaceId
