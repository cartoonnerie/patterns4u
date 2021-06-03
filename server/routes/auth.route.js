import Router from 'express-promise-router'
import passport from '../services/passport/config.js'

/*
import User from '../models/Users.js'
*/

const router = Router()

// TODO redo OAuth2 with passport.js http://www.passportjs.org/packages/passport-oauth2/

router.get('/auth/ravelry', passport.authenticate('ravelry'))
router.get('/auth/ravelry/callback',
  passport.authenticate('ravelry', {
    successRedirect: '/api/patterns',
    failureRedirect: '/api/patterns',
    // failWithError: true,
    session: false
  })
  // TODO send the token to the front
)

export default router
