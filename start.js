var express = require('express'),
    path = require('path'),
    app = express();

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem')
};

app.set('port', (process.env.PORT || 8080));

app.use(express.static('app'));

var server  = require('https').createServer(options, app);
server.listen(8080);