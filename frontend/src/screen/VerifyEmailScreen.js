import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import { useVerifyAccountQuery } from '../slices/userApiSlice'

const VerifyEmailScreen = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Extract token from URL query params (e.g., /verify-email?token=123abc)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const tokenParam = queryParams.get('token') // Extract token
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      toast.error('Invalid or missing verification token.')
      navigate('/login')
    }
  }, [location, navigate])

  // Call the API to verify the email using the token
  const { data, error, isFetching } = useVerifyAccountQuery(token)

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (token && !isFetching) {
        setIsLoading(true)
        if (error) {
          toast.error(error?.data?.message || 'Email verification failed.')
        } else if (data) {
          setIsVerified(true)
          toast.success('Email successfully verified!')
          navigate('/login') // Redirect to login after successful verification
        }
        setIsLoading(false)
      }
    }

    verifyUserEmail()
  }, [token, data, error, isFetching, navigate])

  return (
    <div className='form-container'>
      <h1>Email Verification</h1>
      {isLoading || isFetching ? (
        <Loader />
      ) : isVerified ? (
        <p>
          Your email has been verified! You can now <a href='/login'>log in</a>.
        </p>
      ) : (
        <p>Verifying your email...</p>
      )}
    </div>
  )
}

export default VerifyEmailScreen
