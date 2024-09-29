import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useLogoutMutation } from '../slices/userApiSlice'
import { logout } from '../slices/authSlice' // Adjust the import

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logoutApiCall] = useLogoutMutation()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout()) // Clear user info from Redux store
      navigate('/login') // Redirect to login page
    } catch (error) {
      console.log(error)
    }
  }

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev)
  }

  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <Link to='/'>MyApp</Link>
      </div>
      <ul className='navbar-links'>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        {userInfo && (
          <div className='dropdown'>
            <button onClick={toggleDropdown} className='dropdown-toggle'>
              {userInfo.name} {/* Display the user's name or a generic name */}
            </button>
            {dropdownOpen && (
              <div className='dropdown-menu'>
                <Link to='/profile' className='dropdown-item'>
                  Profile
                </Link>
                <button onClick={logoutHandler} className='dropdown-item'>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        
        
        
      </ul>
    </nav>
  )
}

export default Navbar
