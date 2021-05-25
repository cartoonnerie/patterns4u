const secrets = require('./secret.config');

const authConfig = {};
const serverConfig = require('./server.config');

authConfig.client_id = '574fc9580781db3a0b649c91156a440f';
authConfig.client_secret = secrets.CLIENT;
authConfig.callback_url = serverConfig.server_url + '/login/callback';

module.exports = authConfig;
