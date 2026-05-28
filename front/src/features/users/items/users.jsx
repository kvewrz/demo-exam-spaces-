import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useContext, useEffect, useState } from 'react'
import { ToastContext } from '../../../widgets/toast/toast-provider'
import { UsersContext } from '../provider/users-provider'
import './items.css'

function Users() {
    const {showToast} = useContext(ToastContext)
    const {adminUser , loader , setLoader , updateUsers, getUsers , limit , setLimit, page , setPage , total , setTotal} = useContext(UsersContext)
    useEffect(() => {
        getUsers(page , limit)
    }, [page , limit])
    const onUpdate = async (id , isActive) => {
        try{
            const data = await updateUsers(id , !isActive)
            showToast('удачно обновили статус', 'success')
            setShow(false)
            return data
        }catch(error){
            showToast(error?.response?.data?.error , 'error')
            setLoader(false)
        }
    }
    const maxPage = Math.ceil(total / limit)
    const numberPage = Array.from({length:maxPage}, (_ , i) => i + 1)
  return (
    <div className='block-items'>
      <h1>Profile Admins</h1>
      <div className='filter'>
      <label>
        limit
        <input type="number" value={limit} onChange={(e) => {
            const value =  e.target.value
            setLimit(value > 0 ? value : 1)
        }} />
      </label>
      </div>
      <div className='grid'>
       {adminUser.map(user => (
<div className='items' key={user.id}>
        <h1>Name: {user?.name}</h1>
        <h2>Email: {user?.email}</h2>
        <h2>Role: {user?.role}</h2>
        <h2>Status: {user?.isActive ? 'true' : 'false'}</h2>
        <button onClick={() => onUpdate(user.id , user.isActive)}>{user.isActive ? 'заблокировать': 'разблокировать'}</button>
      </div>
      ))}  
      </div>
      <div className='block-page'>
        <button onClick={() => setPage(prev => prev - 1)} disabled={page === 0}>Back</button>
        {numberPage.map(num => (
            <button className={page === num ? 'active' : ''} key={num} onClick={() => setPage(num)}>{num}</button>
        ))}
        <button onClick={() => setPage(prev => prev ? maxPage : prev + 1)}>Next</button>
      </div>
    </div>
  )
}

export default Users
