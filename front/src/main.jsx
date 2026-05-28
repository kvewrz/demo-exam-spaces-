import { createRoot } from 'react-dom/client'
import './index.css'
import ToastProvider from './widgets/toast/toast-provider'
import { RouterProvider } from 'react-router'
import router from './app/router/router'
import AuthProvider from './features/auth/provider/auth-provider'
import UsersProvider from './features/users/provider/users-provider'
import SpacesProvider from './features/spaces/provider/spaces-provider'
import ReviewsProvider from './features/reviews/provider/reviews-provider'
import BookingProvider from './features/bookings/provider/bookings-provider'


createRoot(document.getElementById('root')).render(
<>
<ToastProvider>
  <AuthProvider>
    <UsersProvider>
      <SpacesProvider>
        <ReviewsProvider>
          <BookingProvider>
         <RouterProvider router={router}></RouterProvider>    
          </BookingProvider>
        </ReviewsProvider>
      </SpacesProvider>
    </UsersProvider>
  </AuthProvider>
</ToastProvider>
</>
)
