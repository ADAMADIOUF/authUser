import express from "express";
import { checkAuth, forgotPassword, getUserProfile, login, logout,  resetPassword,  signup, updateUserProfile, verifyAccount } from "../controllers/auth.js";
import { admin, protect } from '../middleware/authMiddleware.js'
const router = express.Router()
router.post("/signup",signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/verify/:token', verifyAccount)
router.post('/forgot-password', forgotPassword); // Request reset link
router.put('/reset-password/:token', resetPassword); // Reset password using the token
router
  .route('/profile')
  .get(protect, getUserProfile) 
  .put(protect, updateUserProfile)
router.get('/check-auth', protect, checkAuth)
export default router