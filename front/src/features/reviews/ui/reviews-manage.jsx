import { useContext, useEffect } from "react"
import { ReviewsContext } from "../provider/reviews-provider"
import { useParams } from "react-router"
import { ToastContext } from "../../../widgets/toast/toast-provider"


function ReviewsManage() {
  const {showToast} = useContext(ToastContext)
    const {id:spaceId} = useParams()
    const {reviews , manageReviews , page , limit , removeReviews , updateReviews} = useContext(ReviewsContext)
    useEffect(() => {
        manageReviews(spaceId, page , limit )
    }, [spaceId , page , limit])
    const onRemove = async (id) => {
      try{
        const data = await removeReviews(id)
        showToast('удачно удалили', 'success')
        return data
      }catch(error){
        showToast(error?.response?.data?.error , 'error')
      }
    }
    const onUpdate = async (id , isHidden) => {
      try{
        const data = await updateReviews(id , !isHidden)
        showToast('удачно изменили статус', 'success')
        return data
      }catch(error){
        showToast(error?.response?.data?.error , 'error')
      }
    }
  return (
    <div>
      <div className="block-items">
        {reviews.map(review => (
         <div key={review.id} className='items'>
            <h1>Name: {review?.User?.name}</h1>
            <h2>Rating: {review?.rating}</h2>
            <h2>Text: {review?.text}</h2>
            <h2>isHidden: {review?.isHidden ? 'true' : 'false'}</h2>
            <button onClick={() => onRemove(review.id)}>Remove</button>
            <button onClick={() => onUpdate(review.id , review.isHidden)}>{review?.isHidden ? "показать" : 'скрыть'}</button>
        </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsManage
