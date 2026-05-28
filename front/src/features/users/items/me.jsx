import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useContext, useEffect, useState } from 'react'
import { ToastContext } from '../../../widgets/toast/toast-provider'
import { UsersContext } from '../provider/users-provider'
import Loader from '../../../widgets/loader/loader'
import './items.css'
const schema = yup.object({
    name:yup.string().min(1, 'минимум 1 символ').required('поле обязательно'),
    email:yup.string().email("@ не коректный емаил").required('поле обязательно'),
})
function Me() {
    const {showToast} = useContext(ToastContext)
    const [show , setShow] = useState(false)
    const {user , loader , setLoader , updateUser, getUser} = useContext(UsersContext)
    useEffect(() => {
        getUser()
    }, [])
    useEffect(() => {
        if(user){
            reset(user)
        }
    }, [user])
    const {register , handleSubmit , formState:{errors}, reset} = useForm({
        resolver:yupResolver(schema)
    })
    const onUpdate = async (form) => {
        try{
            const data = await updateUser(form)
            showToast('удачно обновили данные', 'success')
            setShow(false)
            return data
        }catch(error){
            showToast(error?.response?.data?.error , 'error')
            setLoader(false)
        }
    }
    if(loader){
        return <Loader />
    }
  return (
    <div className='block-items'>
      <h1>Profile</h1>
      <div className='items'>
        <h1>Name: {user?.name}</h1>
        <h2>Email: {user?.email}</h2>
        <h2>Role: {user?.role}</h2>
        <h2>Status: {user?.isActive ? 'true' : 'false'}</h2>
        <button onClick={() => setShow(true)}>Update</button>
        {show && (
            <div className='block-form'>
               <form className='form' onSubmit={handleSubmit(onUpdate)}>
        <label>
            Name
            {errors?.name && <span className='error-message'>{errors?.name?.message}</span>}
            <input type="text" className={errors?.name ? 'error-input' : ''} {...register('name')} />
        </label>
        <label>
            Email
            {errors?.email && <span className='error-message'>{errors?.email?.message}</span>}
            <input type="text" className={errors?.email ? 'error-input' : ''} {...register('email')} />
        </label>
        <button>Update</button>
    </form>
        </div>
        )}
      </div>
    </div>
  )
}

export default Me
