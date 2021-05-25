const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const serverConfig = require('./config/server.config.js');

// const functPDF = require('./patternPDF/convert/data.pdf');
// functPDF.createPatternPDF();

const DATABASE_URL = process.env.DATABASE_URL || 'localhost:27017';
mongoose.connect(`mongodb://${DATABASE_URL}/${serverConfig.db_name}`,
    {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected');

  const app = express();
  app.use(bodyParser.json());
  app.use(cors({origin: [serverConfig.client_url]}));
  app.use(session({
    secret: serverConfig.session_secret,
    resave: false,
    saveUninitialized: false,
  }));
  // app.use('/', require('./routes/auth'));
  // app.use('/api/users', require('./routes/users'));
  // app.use('/api/patterns', require('./routes/patterns'));

  https.globalAgent.options.rejectUnauthorized = false;
  const key = fs.readFileSync('./security/localhostCertKey.pem');
  const cert = fs.readFileSync('./security/localhostCert.pem');
  const opts = {
    key: key,
    cert: cert,
  };

  const port = serverConfig.api_port;
  const server = https.createServer(opts, app);
  server.listen(port, () => {
    console.log(`server listening on ${port}`);
  });
});
