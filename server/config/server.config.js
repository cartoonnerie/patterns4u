import { SESSION } from './secret.config'

const serverConfig = {}

serverConfig.db_name = 'knitting-website'
serverConfig.api_port = 8080
serverConfig.server_url = 'https://localhost:' + serverConfig.api_port
serverConfig.client_url = 'http://localhost:8080'
serverConfig.session_secret = SESSION

export default serverConfig
