import { CLIENT } from './secret.config.js'
import { serverUrl } from './server.config.js'

const authConfig = {}

authConfig.client_id = '574fc9580781db3a0b649c91156a440f'
authConfig.client_secret = CLIENT
authConfig.callback_url = serverUrl + '/login/callback'

export default authConfig
