
const AuthStorage = {
setAccessToken:(token) => localStorage.setItem('accessToken', token),
getAccessToken:()=> localStorage.getItem('accessToken'),
setRefreshToken:(token) => localStorage.setItem('refreshToken', token),
getRefreshToken:() => localStorage.getItem('refreshToken'),
setUserStorage:(user) => localStorage.setItem('user', JSON.stringify(user)),
getUserStorage:() => {
    const userLocal = localStorage.getItem('user')
    if(userLocal){
        return JSON.parse(userLocal)
    }
},
clear:() => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}
}
export default AuthStorage