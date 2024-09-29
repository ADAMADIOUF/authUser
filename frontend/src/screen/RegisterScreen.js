import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useRegisterMutation } from '../slices/userApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import { FaCheck, FaTimes } from 'react-icons/fa' // For check and cross icons

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [register, { isLoading }] = useRegisterMutation()
  const { userInfo } = useSelector((state) => state.auth)
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const validatePassword = (password) => {
    const length = password.length >= 6
    const uppercase = /[A-Z]/.test(password)
    const lowercase = /[a-z]/.test(password)
    const number = /\d/.test(password)
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    setPasswordStrength({
      length,
      uppercase,
      lowercase,
      number,
      specialChar,
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      // Make the registration API call
      const res = await register({ name, email, password }).unwrap()

      // Assume that the response contains a success message and some user data
      dispatch(setCredentials({ ...res }))

      // Redirect user to the verify email page with the user's email
      navigate(`/verify?email=${email}`)

      toast.success(
        'Registration successful! Please check your email for a verification link.'
      )
    } catch (error) {
      // Handle errors and show error notification
      toast.error(error?.data?.message || error.error)
    }
  }


  useEffect(() => {
    validatePassword(password)
  }, [password])

  const getStrength = () => {
    const { length, uppercase, lowercase, number, specialChar } =
      passwordStrength
    const validConditions = [
      length,
      uppercase,
      lowercase,
      number,
      specialChar,
    ].filter(Boolean).length
    return (validConditions / 5) * 100
  }

  return (
    <div className='form-container'>
      <h1>Register</h1>
      <form onSubmit={submitHandler} className='register-form'>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            placeholder='Enter your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
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
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className='password-strength'>
          <div className='password-criteria'>
            <p>
              {passwordStrength.length ? (
                <FaCheck className='valid' />
              ) : (
                <FaTimes className='invalid' />
              )}{' '}
              At least 6 characters
            </p>
            <p>
              {passwordStrength.uppercase ? (
                <FaCheck className='valid' />
              ) : (
                <FaTimes className='invalid' />
              )}{' '}
              Contains an uppercase letter
            </p>
            <p>
              {passwordStrength.lowercase ? (
                <FaCheck className='valid' />
              ) : (
                <FaTimes className='invalid' />
              )}{' '}
              Contains a lowercase letter
            </p>
            <p>
              {passwordStrength.number ? (
                <FaCheck className='valid' />
              ) : (
                <FaTimes className='invalid' />
              )}{' '}
              Contains a number
            </p>
            <p>
              {passwordStrength.specialChar ? (
                <FaCheck className='valid' />
              ) : (
                <FaTimes className='invalid' />
              )}{' '}
              Contains a special character
            </p>
          </div>
          <div className='progress-bar'>
            <div
              className='progress'
              style={{
                width: `${getStrength()}%`,
                backgroundColor: getStrength() > 80 ? 'green' : 'orange',
              }}
            ></div>
          </div>
        </div>

        <button type='submit' className='btn' disabled={isLoading}>
          Register
        </button>
        {isLoading && <Loader />}
      </form>
      <div className='redirect'>
        <p>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterScreen
