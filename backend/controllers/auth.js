import {
 sendPasswordResetEmail,
 sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../mailtrap/mailtrap.js' // Ensure you're importing both email functions
import jwt from 'jsonwebtoken'
import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
const generateNumericCode = (length) => {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10) 
  }
  return code
}


export const signup = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body

 
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  
  const verificationCode = generateNumericCode(6) 

 
  const user = new User({
    email,
    password,
    name,
    verificationToken: verificationCode, 
    verificationExpiresAt: Date.now() + 3600000, 
  })

  try {
    await user.save() 
    await sendVerificationEmail(email, verificationCode)
    

    res.status(201).json({
      message: 'User registered successfully! Please verify your email.',
    })
  } catch (error) {
    res.status(400).json({
      message: 'Error registering user',
      error: error.message,
    })
  }
})


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find the user by email
  const user = await User.findOne({ email })

  // Check if user exists and password is correct
  if (user && (await user.matchPassword(password))) {
    // Update the lastLogin field
    user.lastLogin = Date.now()
    await user.save() // Save the updated user data

    // Generate token and send response
    generateToken(res, user._id)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      lastLogin: user.lastLogin, 
    })
  } else {
    res.status(400).json({ message: 'Invalid email or password' })
  }
})

export const logout = asyncHandler(async (req, res) => {
  
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({ message: 'Logged out successfully' })
})


export const verifyAccount = asyncHandler(async (req, res) => {
  const { token } = req.params 
  const user = await User.findOne({
    verificationToken: token,
    verificationExpiresAt: { $gt: Date.now() }, 
  })

  
  if (!user) {
    console.log('Token not found or expired:', token)
    return res
      .status(400)
      .json({ message: 'Invalid or expired verification token' })
  }

  
  user.isVerified = true
  user.verificationToken = undefined 
  user.verificationExpiresAt = undefined 
  await user.save()

  await sendWelcomeEmail(user.email) 

  
  res.status(200).json({
    message: 'Account verified successfully, welcome email sent.',
  })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  // Find the user by email
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Set reset password token and expiry time (1 hour from now)
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  user.resetPasswordExpiresAt = Date.now() + 3600000 // 1 hour

  await user.save()

  // Create reset password link
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`

  try {
    // Send password reset email
    await sendPasswordResetEmail(user.email, resetUrl)

    res.status(200).json({ message: 'Reset link sent to your email' })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpiresAt = undefined
    await user.save()

    res
      .status(500)
      .json({ message: 'Email could not be sent', error: error.message })
  }
})

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  // Hash the token to match the stored token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  // Find user by token and check if token has not expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiresAt: { $gt: Date.now() }, // Token is still valid
  })

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' })
  }

  // Set the new password
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpiresAt = undefined

  await user.save()

  // Send password reset success email
  await sendResetSuccessEmail(user.email)

  res
    .status(200)
    .json({ message: 'Password reset successful, you can now log in' })
})

// Check Auth
export const checkAuth = asyncHandler(async (req, res) => {
  // If protect middleware passes, req.user will be available
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isVerified: req.user.isVerified,
  })
})
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      
    })
  } else {
    res.status(400)
    throw new Error('User not found')
  }
})
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    
    })
  } else {
    res.status(400)
    throw new Error('User not found')
  }
})