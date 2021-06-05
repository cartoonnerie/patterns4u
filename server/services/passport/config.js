import debug from 'debug'
import passport from 'passport'
import { config } from 'dotenv'

import authConfig from '../../config/auth.config.js'
import Users from '../../models/Users.js'
import RavelryStrategy from './strategy.js'

const DEBUG = debug('dev')
config()

const oauthStrategy = new RavelryStrategy({
  clientID: authConfig.client_id,
  clientSecret: authConfig.client_secret,
  callbackURL: 'https://localhost:8080/auth/ravelry/callback',
  state: 'dksjhkjsdhfksejdfhkjdshfksjdfkhsj'
},
async function (accessToken, refreshToken, profile, done) {
  const { id, username } = profile
  let user = await Users.findOne({ ravelryId: id })
  if (user) {
    DEBUG(user)
    return done(null, user, { accessToken, refreshToken })
  }
  user = await Users.create({ ravelryId: id, username })
  DEBUG(`new User ${user}`)
  DEBUG({ user, accessToken, refreshToken })
  return done(null, user, { accessToken, refreshToken })
})
passport.use('ravelry', oauthStrategy)

export default passport
