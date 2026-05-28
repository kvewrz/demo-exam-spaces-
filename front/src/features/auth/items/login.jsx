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
    email:yup.string().email("@ не коректный емаил").required('поле обязательно'),
    password:yup.string().min(1 , 'минимум 1 символ').required('поле обязательно'),
})
function Login() {
    const navigate = useNavigate()
    const {showToast} = useContext(ToastContext)
    const {login , loader , setLoader} = useContext(AuthContext) 
    const {register , handleSubmit , formState:{errors}} = useForm({
        resolver:yupResolver(schema)
    })
    const onLog = async (form) => {
        try{
            const data = await login(form)
            showToast('удачно зарегестрировались', 'success')
            navigate('/spaces')
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
    <h1>Login</h1>
    <form className='form' onSubmit={handleSubmit(onLog)}>
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
        <button>Login</button>
    </form>
   </div>
  )
}

export default Login 
