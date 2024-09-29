import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
dotenv.config()
connectDB()

const app = express()
const port = 5000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/auth', authRoutes)

app.listen(port, () => {
  console.log(`the app runnint at port ${port}`)
})
