import { createContext, useState } from "react"
import './toast.css'
export const ToastContext = createContext()
function ToastProvider({children}) {
    const [items , setItems] = useState([])
    const showToast = (message , type='info') =>{
        const id = crypto.randomUUID()
        setItems(prev => [...prev , {id , message , type}])
        setTimeout(() => {
            setItems(prev => prev.filter(el => el.id !== id))
        }, 3000)
    }
    const remove = (id) => {
        setItems(prev => prev.filter(el => el.id !== id))
    } 
  return (
    <ToastContext value={{showToast}}>
        {children}
        <div className="toast-container">
            {items.map(item => (
                <div key={item.id} className={`toast toast-${item.type}`}>
                    <div className="toast-message">
                        <h2>{item.message}</h2>
                    </div>
                    <span onClick={() => remove(item.id)}>X</span>
                </div>
            ))}
        </div>
    </ToastContext>
  )
}

export default ToastProvider
