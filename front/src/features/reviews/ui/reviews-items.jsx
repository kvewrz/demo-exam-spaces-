import React, { useContext, useEffect } from 'react'
import { ReviewsContext } from '../provider/reviews-provider'
import { useParams } from 'react-router'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { ToastContext } from '../../../widgets/toast/toast-provider'
import { AuthContext } from '../../auth/provider/auth-provider'
const schema = yup.object({
    text: yup.string().min(1, 'минимум 1').required('поле обязательно'),
    rating: yup.number().typeError('только число').min(1,'минимум 1 символ').required('поле обязательно')
})
function ReviewsItems() {
    const {id:spaceId} = useParams()
  
    const {showToast} = useContext(ToastContext)
    const {reviews , getReviews, page , limit, setLimit , setPage, total , createReviews} = useContext(ReviewsContext)
    useEffect(() => {
        getReviews(spaceId , page , limit)
    }, [spaceId ,page, limit])
    const {register , handleSubmit, formState:{errors}, reset} = useForm({
        resolver:yupResolver(schema)
    })
  
    const maxPage = Math.ceil(total / limit)
    const nextPage = Array.from({length:maxPage}, (_,i) => i + 1)
    const onCreate = async (form) => {
        try{
            const data = await createReviews({
                ...form,
                spaceId
            })
            showToast('оставили отзывы', 'success')
            reset()
            return data
        }catch(error){
            showToast(error?.response?.data?.error , 'error')
        }
    }
  return (
    <div>
             <div className='block-form'>
            <form className='form' onSubmit={handleSubmit(onCreate)}>
                <label>
            Text 
            {errors?.text && <span className='error-message'>{errors?.text?.message}</span>}
            <input type="text" className={errors?.text ? 'error-input' : ''} {...register('text')}/>
        </label>
        <label>
            Rating 
            {errors?.rating && <span className='error-message'>{errors?.rating?.message}</span>}
            <input type="text" className={errors?.rating ? 'error-input' : ''} {...register('rating')}/>
        </label>
        <button>Create</button>
            </form>
        </div>

        <div className='block-items'>
        <h1>Reviews</h1>
        <div className='filter'>
            <label>
                Limit
                <input type="number" value={limit} onChange={(e) => {
                    const value = e.target.value
                    setLimit(value > 0 ? value : 1)
                }} />
            </label>
        </div>
      {reviews.map(review => (
        <div key={review.id} className='items'>
            <h1>Name: {review?.User?.name}</h1>
            <h2>Rating: {review?.rating}</h2>
            <h2>Text: {review?.text}</h2>
            <h2>isHidden: {review?.isHidden ? 'true' : 'false'}</h2>
        </div>
      ))}
      <div className='block-page'>
        <button onClick={() => setPage(prev => prev - 1)} disabled={page === 1} >Back</button>
        {nextPage.map(next => (
            <button className={page === next ? 'active' : ''} onClick={() => setPage(next)}>{next}</button>
        ))}
        <button onClick={() => setPage(prev => prev ? maxPage : prev + 1)}>Next</button>
      </div>
    </div>
    </div>
  )
}

export default ReviewsItems
