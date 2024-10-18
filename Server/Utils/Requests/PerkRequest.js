const fs = require("fs");
const request = require("request");
const credentials = require("../../../Config/config.json");
const {
  Api: { ApiKey, access_token },
  SteamAccount: { memberShipType, memberShipId, characterId },
} = credentials;
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

request.get(
  {
    url: `https://www.bungie.net//Platform/Destiny2/${memberShipType}/Profile/${memberShipId}/Character/${characterId}/Vendors/672118013/?definitions=true&components=402,305,310`,
    headers: {
      "X-API-KEY": ApiKey,
      Authorization: "Bearer " + access_token,
    },
  },
  function (err, res, body) {
    console.log(" \nstatus code: " + res.statusCode + "\ncookie: " + res.headers["set-cookie"]);

    const response = JSON.parse(body);
    //console.log(response)
    fs.writeFile(
      "Cache/PerkRequest.json",
      body,
      {
        flag: "w",
      },
      function (err, result) {
        if (err) console.log("error", err);
      }
    );
  }
);
