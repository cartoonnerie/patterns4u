// import debug from 'debug'
import passport from 'passport'
import { config } from 'dotenv'

import authConfig from '../../config/auth.config.js'
import RavelryStrategy from './strategy.js'

// const DEBUG = debug('dev')
config()

const oauthStrategy = new RavelryStrategy({
  clientID: authConfig.client_id,
  clientSecret: authConfig.client_secret,
  callbackURL: 'https://localhost:8080/auth/ravelry/callback',
  state: 'dksjhkjsdhfksejdfhkjdshfksjdfkhsj'
},
function (accessToken, refreshToken, profile, done) {
  done()
  // User.findOrCreate(..., function(err, user) {
  //   done(err, user);
  // });
})
passport.use('ravelry', oauthStrategy)

export default passport
