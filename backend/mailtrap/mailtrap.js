// emailService.js
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from './emailTemplates.js'

dotenv.config()

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
})

// Send Verification Email
export const sendVerificationEmail = async (toEmail, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Verify your email',
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      '{verificationCode}',
      verificationCode
    ),
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Verification email sent successfully')
  } catch (error) {
    console.error('Error sending verification email:', error)
  }
}

// Send Welcome Email
export const sendWelcomeEmail = async (toEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Welcome to Our App!',
    html: '<h1>Welcome!</h1><p>Thank you for verifying your email. We are excited to have you onboard!</p>',
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Welcome email sent successfully')
  } catch (error) {
    console.error('Error sending welcome email:', error)
  }
}

// Send Password Reset Email
export const sendPasswordResetEmail = async (toEmail, resetURL) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Reset your password',
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Password reset email sent successfully')
  } catch (error) {
    console.error('Error sending password reset email:', error)
  }
}

// Send Password Reset Success Email
export const sendResetSuccessEmail = async (toEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Password Reset Successful',
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Password reset success email sent successfully')
  } catch (error) {
    console.error('Error sending password reset success email:', error)
  }
}
