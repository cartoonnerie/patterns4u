import https from 'https'
import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import mongoose from 'mongoose'

import serverConfig from './config/server.config'

import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import patternRoutes from './routes/pattern'

// import functPDF from './patternPDF/convert/data.pdf'
// functPDF.createPatternPDF();

const DATABASE_URL = process.env.DATABASE_URL || 'localhost:27017'
mongoose.connect(`mongodb://${DATABASE_URL}/${serverConfig.db_name}`,
  { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Database connected')

  const app = express()
  app.use(bodyParser.json())
  app.use(cors({ origin: [serverConfig.client_url] }))
  app.use(session({
    secret: serverConfig.session_secret,
    resave: false,
    saveUninitialized: false
  }))

  app.use('/', authRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/patterns', patternRoutes)

  https.globalAgent.options.rejectUnauthorized = false
  const key = fs.readFileSync('./security/localhostCertKey.pem')
  const cert = fs.readFileSync('./security/localhostCert.pem')
  const opts = {
    key,
    cert
  }

  const port = serverConfig.api_port
  const server = https.createServer(opts, app)
  server.listen(port, () => {
    console.log(`server listening on ${port}`)
  })
})
