import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { AuthContext } from '../provider/auth-provider'
import { useNavigate } from 'react-router'
import { ToastContext } from '../../../widgets/toast/toast-provider'
import Loader from '../../../widgets/loader/loader'
import './form.css'
const schema = yup.object({
    name:yup.string().min(1, 'минимум 1 символ').required('поле обязательно'),
    email:yup.string().email("@ не коректный емаил").required('поле обязательно'),
    password:yup.string().min(1 , 'минимум 1 символ').required('поле обязательно'),
    confirm: yup.string().oneOf([yup.ref('password')], 'пароли не совпадают').required('поле обязательно и справильным паролем')
})
function Register() {
    const navigate = useNavigate()
    const {showToast} = useContext(ToastContext)
    const {register:reg , loader , setLoader} = useContext(AuthContext) 
    const {register , handleSubmit , formState:{errors}} = useForm({
        resolver:yupResolver(schema)
    })
    const onReg = async (form) => {
        try{
            const data = await reg(form)
            showToast('удачно зарегестрировались', 'success')
            navigate('/auth/login')
            return data
        }catch(error){
            showToast(error?.response?.data?.error  , 'error')
            setLoader(false)
        }
    }
    if(loader){
        return <Loader />
    }
  return (
   <div className='block-form'>
    <h1>Registration</h1>
    <form className='form' onSubmit={handleSubmit(onReg)}>
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
        <label>
            Password 
            {errors?.password && <span className='error-message'>{errors?.password?.message}</span>}
            <input type="password" className={errors?.password ? 'error-input' : ''} {...register('password')} />
        </label>
        <label>
            Confirm
            {errors?.confirm && <span className='error-message'>{errors?.confirm?.message}</span>}
            <input type="password" className={errors?.confirm ? 'error-input' : ''} {...register('confirm')} />
        </label>
        <button>Registration</button>
    </form>
   </div>
  )
}

export default Register
