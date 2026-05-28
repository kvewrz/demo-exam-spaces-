import { useContext } from "react"
import { AuthContext } from "./auth-provider"
import { ToastContext } from "../../../widgets/toast/toast-provider"
import { Navigate } from "react-router"
import Loader from "../../../widgets/loader/loader"


function GuardProvider({children , isRole}) {
    const {showToast} = useContext(ToastContext)
    const {user , loader , setLoader} = useContext(AuthContext)
   if(loader){
    return <Loader />
   }
    if(!user){
        setTimeout(() => {
            showToast('Сначала зарегестрируйтесь', 'error')
        }, 300)
        return <Navigate to={`/auth/login`}></Navigate>
    }
    if(!isRole.includes(user.role)){
        setTimeout(() => {
            showToast('не достаточно прав', 'error')
        }, 300)
        return <Navigate to={`/spaces`}></Navigate>
    }
  return (
    <div>
      {children}
    </div>
  )
}

export default GuardProvider
