const fs = require('fs');
const request = require("request");
const credentials = require('../Config/config.json')
const { ApiKey, client_id, client_secret } = credentials

/* While it's possible to log in again and again to bungie.net with the account to get the access token and make a VendorRequest,
rather let's use the refresh token to get the access token,without having to log in for each VendorRequest.
NB!! refresh token has an expiration date of 90 days,after that you will  have to log in again.
*/
const X = btoa(client_id + ":" + client_secret);
request.post({
    url: 'https://www.bungie.net/Platform/App/OAuth/Token/',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Key': ApiKey,
        'Authorization': 'Basic ' + X,
    },
    form: {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,

    }

}, function (err, res, body) {
    console.log(body + " \nstatus code: " + res.statusCode + "\ncookie: " + res.headers['set-cookie']);
    /* const response = JSON.stringify(res);
 fs.writeFile("./Cache/TokenRequest.json", response, function(err, result) {
    if(err) console.log('error', err);
});  */
});
