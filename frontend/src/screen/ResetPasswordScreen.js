import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useResetPasswordMutation } from '../slices/userApiSlice' // Adjust the import based on your API slice
import Loader from '../components/Loader'

const ResetPasswordScreen = () => {
  const { token } = useParams() // Extract the token from the URL
  const navigate = useNavigate() // Hook to navigate to login
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      await resetPassword({ token, password }).unwrap()
      toast.success('Password reset successfully!')
      navigate('/login') // Navigate to login page after success
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to reset password')
    }
  }

  return (
    <div className='reset-password-container'>
      <h2>Reset Password</h2>
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label htmlFor='password'>New Password</label>
          <input
            type='password'
            id='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password'
            id='confirmPassword'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='update-button'>
          Reset Password
        </button>
        {isLoading && <Loader />}
      </form>
    </div>
  )
}

export default ResetPasswordScreen
