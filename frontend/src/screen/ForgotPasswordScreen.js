import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useForgotPasswordMutation } from '../slices/userApiSlice'
import Loader from '../components/Loader'

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword({ email }).unwrap()
      toast.success('Password reset link sent to your email.')
      navigate('/login')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='form-container'>
      <h1>Forgot Password</h1>
      <form onSubmit={submitHandler} className='forgot-password-form'>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            id='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type='submit' className='btn' disabled={loading || isLoading}>
          Send Reset Link
        </button>

        {loading || isLoading ? <Loader /> : null}
      </form>

      <div className='redirect'>
        <p>
          Remember your password? <Link to='/login'>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgetPasswordScreen
