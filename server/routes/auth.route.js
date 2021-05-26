import Router from 'express-promise-router'
import { AuthorizationCode } from 'simple-oauth2'
import { generate as generateRandomString } from 'randomstring'

import serverConfig from '../config/server.config'
import authConfig from '../config/auth.config'
import routeProtection from '../controller/routeProtection.controller'

import User from '../models/User'

const router = Router()

// TODO redo OAuth2 with passport.js http://www.passportjs.org/packages/passport-oauth2/

const client = new AuthorizationCode({
  auth: {
    tokenHost: 'https://www.ravelry.com',
    tokenPath: '/oauth2/token',
    authorizePath: '/oauth2/auth'
  },
  client: {
    id: authConfig.client_id,
    secret: authConfig.client_secret
  },
  options: {
    authorizationMethod: 'header'
  }
})

router.get('/login', (req, res) => {
  const callbackUrl = client.authorizeURL({
    redirect_uri: authConfig.callback_url,
    scope: 'offline',
    state: generateRandomString()
  })

  res.redirect(callbackUrl)
})

router.get('/login/callback', async (req, res) => {
  const { code } = req.query
  const options = {
    code,
    redirect_uri: authConfig.callback_url
  }

  try {
    const tokenObject = await client.getToken(options)
    const token = tokenObject.token
    console.log(token)
    const currentUser = await routeProtection.getCurrentUser(token.access_token)
    console.log(currentUser)
    const user = await User.findById(currentUser.id, 'username')
    if (!user) {
      const newUser = new User({
        _id: currentUser.id,
        username: currentUser.username
      })
      console.log(newUser)
      await newUser.save()
    }
    req.session.accessToken = token.access_token
    res.cookie('username', currentUser.username)
    res.cookie('userId', currentUser.id)
    res.redirect(serverConfig.client_url)
  }
  catch (error) {
    console.error(error)
  }
})

router.post('/logout', (req, res) => {
  req.session().destroy()
  res.status(200)
})

export default router
