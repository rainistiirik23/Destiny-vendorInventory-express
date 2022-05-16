const credentials = require('../Config/config.json')
const {ApiKey} = credentials
const {client_id} = credentials
const {client_secret} = credentials
const {code} = credentials
const request = require("request");
const fs = require('fs');
const X = btoa(client_id + ":" + client_secret);
// Request for a Token which Oauth requires to make a VendorRequest
request.post({
    url: 'https://www.bungie.net/Platform/App/OAuth/Token/',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Key': ApiKey,
        'Authorization': 'Basic ' + X
    },
    form: {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'code': code
    }
}, function (err, res, body) {
    console.log(body + " \nstatus code: " + res.statusCode + "\ncookie: " + res.headers['set-cookie']);
/*const response = JSON.stringify(res);
fs.writeFile("./Cache/TokenRequest.json", response, function(err, result) {
    if(err) console.log('error', err);
});*/
});
