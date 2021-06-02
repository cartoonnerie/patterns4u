import express from 'express'
import cors from 'cors'
import session from 'express-session'

import logger from 'morgan'
import { config } from 'dotenv'
import passport from 'passport'
import errorHandler from './middleware/errorHandler.js'

import serverConfig from './config/server.config.js'

import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/users.route.js'
import patternRoutes from './routes/patterns.route.js'

config()

const app = express()

if (['development', 'production'].includes(process.env.NODE_ENV)) {
  app.use(logger('dev'))
}

app.use(cors({ origin: [serverConfig.client_url] }))
app.use(session({
  secret: serverConfig.session_secret,
  resave: false,
  saveUninitialized: false
}))
app.use(express.json())
app.use(errorHandler)

app.use(passport.initialize())

app.use('/', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/patterns', patternRoutes)

export default app
