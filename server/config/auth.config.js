import { CLIENT } from './secret.config'
import serverConfig from './server.config'

const authConfig = {}

authConfig.client_id = '574fc9580781db3a0b649c91156a440f'
authConfig.client_secret = CLIENT
authConfig.callback_url = serverConfig.server_url + '/login/callback'

export default authConfig
