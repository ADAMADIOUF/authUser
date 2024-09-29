import React, { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useProfileMutation } from '../slices/userApiSlice'
import Loader from '../components/Loader'
import { setCredentials } from '../slices/authSlice'

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { userInfo } = useSelector((state) => state.auth)
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation()

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [userInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password) {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap()
        dispatch(setCredentials(res))
        toast.success('Profile updated successfully')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    } else {
      // If no password is provided, update only name and email
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
        }).unwrap()
        dispatch(setCredentials(res))
        toast.success('Profile updated successfully')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  return (
    <div className='profile-container'>
      <h2>User Profile</h2>
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            placeholder='Enter password (leave empty to keep current password)'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type='submit' className='update-button'>
          Update
        </button>
        {loadingUpdateProfile && <Loader />}
      </form>
      <div className='orders-container'>
        <h2>My Orders</h2>
        {/* You can render orders here later, if needed */}
      </div>
    </div>
  )
}

export default ProfileScreen
