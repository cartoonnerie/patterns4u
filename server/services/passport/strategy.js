// TODO handle errors
import Strategy from 'passport-strategy'
import axios from 'axios'
import { AuthorizationCode } from 'simple-oauth2'

/**
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
export default class RavelryStrategy extends Strategy {
  constructor (options, verify) {
    super()

    options = options || {}
    this.name = 'ravelry'

    this._verify = verify
    this._callbackURL = options.callbackURL
    this._scope = options.scope || 'offline'
    this._profileURL = 'https://api.ravelry.com/current_user.json'
    if (!options.clientID) { throw new TypeError('RavelryStrategy needs a clientID') }
    this._client_id = options.clientID

    if (!verify) { throw new TypeError('RavelryStrategy requires a verify callback') }

    this._oauth2 = new AuthorizationCode({
      auth: {
        tokenHost: 'https://www.ravelry.com',
        tokenPath: '/oauth2/token',
        authorizePath: '/oauth2/auth',
        revokePath: 'oauth2/revoke'
      },
      client: {
        id: options.clientID,
        secret: options.clientSecret
      }
    })
  }

  async userProfile (tokenObject) {
    const currentUserRes = await axios({
      url: this._profileURL,
      headers: {
        Authorization: 'Bearer ' + tokenObject.token.access_token
      }
    })
    return currentUserRes.data.user
  }

  /**
   *
   * @param {Object} req
   * @param {Object} options
   * @returns
   */
  async authenticate (req, options) {
    options = options || {}

    if (req.query && req.query.error) {
      if (req.query.error === 'access_denied') {
        return this.fail({ message: req.query.error_description })
      }
      else {
        // TODO use more specific error
        return this.error(new Error(req.query.error_description, req.query.error, req.query.error_uri))
      }
    }

    const callbackURL = options.callbackURL || this._callbackURL

    if (req.query && req.query.code) {
      const code = req.query.code
      const state = req.query.state

      // will be called by the client at the very end of the process
      const verified = (err, user, info) => {
        if (err) { return this.error(err) }
        if (!user) { return this.fail(info) }

        info = info || {}
        if (state) { info.state = state }
        this.success(user, info)
      }

      const tokenParams = {
        code,
        redirect_uri: this._callbackURL,
        grant_type: 'authorization_code'
      }
      const tokenObject = await this._oauth2.getToken(tokenParams)
        .catch((err) => { return this.fail(err) })
      const profile = await this.userProfile(tokenObject)
        .catch((err) => { return this.error(err) })
      this._verify(tokenObject.token.access_token, tokenObject.token.refresh_token, profile, verified)
    }
    // if we don't have an authentification code already
    else {
      // TODO manage state
      const params = { state: 'zzdzoiauozdslknsdqdlskd' }
      if (callbackURL) { params.redirect_uri = callbackURL }
      params.scope = this._scope
      this.redirect(this._oauth2.authorizeURL(params))
    }
  }
}
