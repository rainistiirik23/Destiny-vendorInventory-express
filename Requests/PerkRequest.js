const fs = require('fs');
const request = require("request");
const credentials = require('../Config/config.json')
const {ApiKey} = credentials
const {access_token} = credentials
/*let gunKeyList = { 'Guns': [] };

let itemHashList = [];
const data = fs.readFileSync('Cache/VendorRequest.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    }
})
const gunSales = JSON.parse(data)['Response']['sales']['data'];
const gunKeys = Object.keys(gunSales);
//console.log(gunKeys[0]);
for (let i = 7; i <= 12; i++) {
    gunKeyList['Guns'].push(gunKeys[i]);
    itemHashList.push(gunSales[gunKeys[i]]['itemHash']);
}
console.log(gunKeyList, itemHashList);
*/



request.get({
    url: 'https://www.bungie.net//Platform/Destiny2/2/Profile/4611686018436313974/Character/2305843009261697780/Vendors/672118013/?definitions=true&components=302',
    headers: {
        "X-API-KEY": ApiKey,
        "Authorization": access_token,
    },
}, function (err, res, body) {
    //console.log(" \nstatus code: " + res.statusCode + "\ncookie: " + res.headers['set-cookie']);
    const response = JSON.parse(body)
    //console.log(response)
    fs.writeFile("Cache/PerkRequest.json", body, {
        'flag': 'w'
    }, function (err, result) {
        if (err) console.log('error', err);
    });
});
