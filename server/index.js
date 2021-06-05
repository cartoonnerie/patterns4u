import https from 'https'
import fs from 'fs'
import debug from 'debug'
import { config } from 'dotenv'
import { apiPort } from './config/server.config.js'

import app from './app.js'
import './db/mongoose.js'

config()
const DEBUG = debug('dev')

const PORT = process.env.PORT || apiPort || 5000

https.globalAgent.options.rejectUnauthorized = false
const key = fs.readFileSync('./security/localhostCertKey.pem')
const cert = fs.readFileSync('./security/localhostCert.pem')
const opts = {
  key,
  cert
}

const server = https.createServer(opts, app)

process.on('uncaughtException', (error) => {
  DEBUG(`uncaught exception: ${error.message}`)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  DEBUG(err)
  DEBUG('Unhandled Rejection:', {
    name: err.name,
    message: err.message || err
  })
  process.exit(1)
})

server.listen(PORT, () => {
  DEBUG(
    `server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
  )
})
