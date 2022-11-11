const fs = require('fs')
const request = require("request");
const credentials = require('../Config/config.json')
const { ApiKey, access_token } = credentials

// Make a request for a vendor's inventory
const vendorRequest = () => {
    return (
        new Promise((resolve, reject) => {
            request.get({
                url: 'https://www.bungie.net//Platform/Destiny2/2/Profile/4611686018436313974/Character/2305843009261697780/Vendors/672118013/?components=402',
                headers: {
                    "X-API-KEY": ApiKey,
                    "Authorization": "Bearer " + access_token,
                },
            }, (err, res, body) => {
                const bodyAsJson = JSON.parse(body);

                if (bodyAsJson.error) {
                    const moreErrorInfo = body + " \nstatus code: " + res.statusCode;
                    reject(moreErrorInfo);
                }
                else {
                    resolve(bodyAsJson);
                }
            });
        }));
}
const cacheVendorRequest = vendorRequest => new Promise((resolve, reject) => {
    fs.writeFile("./Cache/VendorRequest.json", JSON.stringify(vendorRequest), { 'flag': 'w' }, function (err, result) {
        if (err) {
            reject(console.log('error', err));
        }
        else {
            resolve(console.log('Vendor request is cached'))
        }
    });
})
const vendorRequestCache = async () => {
    try {
        const Request = await vendorRequest();
        await cacheVendorRequest(Request);
    }
    catch (err) {
        console.log(err)
    }
}
vendorRequestCache();
