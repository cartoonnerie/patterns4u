import jwt from 'express-jwt'
import debug from 'debug'
import passport from '../services/passport/config.js'
import { serverSecret } from '../config/server.config.js'

const DEBUG = debug('dev')

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1]
  }
  return null
}

export const auth = {
  required: jwt({
    secret: serverSecret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    algorithms: ['HS256']
  }),
  optional: jwt({
    secret: serverSecret,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    algorithms: ['HS256']
  })
}

export function callbackSendToken (req, res, next) {
  function genToken (err, user, info) {
    DEBUG('ici')
    const userWithToken = user
    DEBUG('here')
    if (err) {
      return next(err)
    }
    DEBUG('not error')
    if (user) {
      userWithToken.token = user.generateJWT()
      DEBUG(userWithToken.token)
      return res.json({ user: userWithToken.toAuthJSON() })
    }

    return res.status(400).info // TODO understand
  }

  return passport.authenticate('ravelry', {
    failureRedirect: '/api/patterns',
    failWithError: true,
    session: false
  },
  genToken
  )(req, res, next)
}
