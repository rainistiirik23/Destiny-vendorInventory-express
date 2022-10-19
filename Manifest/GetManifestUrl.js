const credentials = require('../Config/config.json');
const { ApiKey, client_id, client_secret, code } = credentials
const request = require("request");
const fs = require('fs');
const X = btoa(client_id + ":" + client_secret);
// Request for a Manifest url
request.get({
    url: 'https://www.bungie.net/Platform/Destiny2/Manifest/ ',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-Key': ApiKey,
        'Authorization': 'Basic ' + X
    },
    form: {
        /*  'grant_type': 'authorization_code', */
        'client_id': client_id,
        'code': code
    }
}, function (err, res, body) {
    const jsonResponse = JSON.parse(body);
    console.log(jsonResponse);
    /* fs.writeFile("Cache/Manifest.json", JSON.stringify(jsonResponse), {
    }, function (err, result) {
        if (err) console.log('error', err);
    }); */
    /* console.log(body + " \nstatus code: " + res.statusCode + "\ncookie: " + res.headers['set-cookie']); */
    /*const response = JSON.stringify(res);
    fs.writeFile("./Cache/TokenRequest.json", response, function(err, result) {
        if(err) console.log('error', err);
    });*/
});
