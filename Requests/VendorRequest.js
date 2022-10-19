const fs = require('fs')
const request = require("request");
const credentials = require('../Config/config.json')
const { ApiKey, access_token } = credentials

// Make a request for a vendor's inventory
request.get({
    url: 'https://www.bungie.net//Platform/Destiny2/2/Profile/4611686018436313974/Character/2305843009261697780/Vendors/672118013/?components=402',
    headers: {
        "X-API-KEY": ApiKey,
        "Authorization": "Bearer " + access_token,
    },
}, function (err, res, body) {
    console.log(body + " \nstatus code: " + res.statusCode + "\ncookie: " + res.headers['set-cookie']);
    const response = body;
    fs.writeFile("Cache/VendorRequest.json", response, { 'flag': 'w' }, function (err, result) {
        if (err) console.log('error', err);
    });
});
