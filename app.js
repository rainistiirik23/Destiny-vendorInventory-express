/*const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync('ssl/key.pem', 'utf8');
const certificate = fs.readFileSync('ssl/cert.pem', 'utf8');

var credentials = {
    key: privateKey,
    cert: certificate
};
var express = require('express');
var app = express();

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);*/
const express = require('express');
const https = require('https');
const fs = require('fs');
app = express();

const options = {

    cert: fs.readFileSync("ssl/cert.pem"),
    key: fs.readFileSync("ssl/key.pem")
};


app.get('', function (req, res) {
    res.sendFile('/home/raini/projektid/destiny-vendorbot/myapp/Views/index.html');
});

const server = https.createServer(options, app);
server.listen(3000, () => {
    console.log('listening on https://localhost:3000')
});
