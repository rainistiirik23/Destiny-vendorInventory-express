const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const path = require('path');

const options = {

    cert: fs.readFileSync("ssl/cert.pem"),
    key: fs.readFileSync("ssl/key.pem")
};

app.get('', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'Views/index.html'))
});

const server = https.createServer(options, app);
server.listen(3000, () => {
    console.log('listening on https://localhost:3000')
});
