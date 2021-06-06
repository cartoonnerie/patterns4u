import jwt from 'express-jwt'
import debug from 'debug'
import passport from '../services/passport/config.js'
import { serverSecret } from '../config/server.config.js'

const DEBUG = debug('dev')

/**
 * reads the token from the Atuthorization header
 * @param {*} req
 * @returns the token if any, else null
 */
const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1]
  }
  return null
}

// TODO add audience and issuer
// TODO check if custom getToken function is necessary
export const auth = {
  required: jwt({
    secret: serverSecret,
    userProperty: 'auth',
    getToken: getTokenFromHeaders,
    algorithms: ['HS256']
  }),
  optional: jwt({
    secret: serverSecret,
    userProperty: 'auth',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    algorithms: ['HS256']
  })
}

/**
 * get ravelry token, generate our own token and send them all with the user profile and the state
 * @param {*} req : expect query param 'code' : the autorization code
 * @param {*} res
 * @param {*} next
 * @returns
 */
export function callbackSendToken (req, res, next) {
  function genToken (err, user, info) {
    DEBUG(info)
    if (err) { return next(err) }
    if (user) { return res.json({ ...user.toAuthJSON(), ...info }) }

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
