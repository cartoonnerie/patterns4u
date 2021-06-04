import Router from 'express-promise-router'
import passport from '../services/passport/config.js'
import { auth, callbackSendToken } from '../services/auth.services.js'

/*
import User from '../models/Users.js'
*/

const router = Router()

router.get('/auth/ravelry', auth.optional, passport.authenticate('ravelry'))
router.get('/auth/ravelry/callback', auth.optional, callbackSendToken)

export default router
