import  * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { SpacesContext } from '../../provider/spaces-provider'
import { ToastContext } from '../../../../widgets/toast/toast-provider'

const schema = yup.object({
    title:yup.string().min(1, 'минимум 1 символ').required('поле обязательно'),
    description:yup.string().min(1, 'минимум 1 символ').required('поле обязательно'),
    images:yup.string().min(1, 'минимум 1 символ').required('поле обязательно'),
    zoneType:yup.string().min(1, 'минимум 1 символ').required('поле обязательно'),
    pricePerHour:yup.number().typeError("только число").min(1, 'минимум 1 число').required('поле обязательно'),
    capacity:yup.number().typeError("только число").min(1, 'минимум 1 число').required('поле обязательно'),
    rating:yup.number().typeError("только число").min(1, 'минимум 1 число').required('поле обязательно'),
})
function SpacesUpdate({space , setShow}) {
    const {showToast} = useContext(ToastContext)
    const {update , loader , setLoader} = useContext(SpacesContext)
    const {register , handleSubmit, formState:{errors}, reset} = useForm({
        resolver:yupResolver(schema),
        defaultValues:{...space} 
    })
    const onUpdate = async (form) => {
        try{
            const data = await  update(space.id,form)
            showToast('удачно создали', 'success')
            setShow(false)
            reset()
        }catch(error){
            showToast(error?.response?.data?.error , 'error')
            setLoader(false)
        }
    }
  return (
    <div className='block-form'>
      <form className='form' onSubmit={handleSubmit(onUpdate)}>
        <label>
            Title
            {errors?.title && <span className='error-message'>{errors?.title?.message}</span>}
            <input type="text" className={errors?.title ? 'error-input' : ''} {...register('title')}/>
        </label>
        <label>
            Description 
            {errors?.description && <span className='error-message'>{errors?.description?.message}</span>}
            <input type="text" className={errors?.description ? 'error-input' : ''} {...register('description')}/>
        </label>
        <label>
            Images
            {errors?.images && <span className='error-message'>{errors?.images?.message}</span>}
            <input type="text" className={errors?.images ? 'error-input' : ''} {...register('images')}/>
        </label>
        <label>
            Zone
            {errors?.zoneType && <span className='error-message'>{errors?.zoneType?.message}</span>}
            <select className={errors?.zoneType ? 'error-input' : ''} {...register('zoneType')}>
                <option value="">Выберите что нибудь</option>
                <option value="open-space">open-space</option>
                <option value="meeting-room">meeting-room</option>
                <option value="private-office">private-office</option>
            </select>
        </label>
        <label>
            Price 
            {errors?.pricePerHour && <span className='error-message'>{errors?.pricePerHour?.message}</span>}
            <input type="number" className={errors?.pricePerHour ? 'error-input' : ''} {...register('pricePerHour')}/>
        </label>
        <label>
            Capacity 
            {errors?.capacity && <span className='error-message'>{errors?.capacity?.message}</span>}
            <input type="number" className={errors?.capacity ? 'error-input' : ''} {...register('capacity')}/>
        </label>
        <label>
            Rating 
            {errors?.rating && <span className='error-message'>{errors?.rating?.message}</span>}
            <input type="number" className={errors?.rating ? 'error-input' : ''} {...register('rating')}/>
        </label>
        <button>Update</button>
      </form>
    </div>
  )
}

export default SpacesUpdate
