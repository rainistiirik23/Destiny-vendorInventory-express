/* const request = require("request");
const X = btoa("39169" + ":" + "0ItTsl1ANhv7qjWzHWjH83HKiRUJUaYOhWAXsvEzmls");
const fs = require('fs');
let itemHash = "2272470786"
request.get({
    url: `https://www.bungie.net//Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${itemHash}/`,
    headers: {
        "X-API-KEY":'8195fe743c4d4ec883c50632441f4c83',
        "Authorization": "Bearer CPaJBBKGAgAg/YFG+11YhbWHXY0iPs5HmBSk/Z9818RSzHgiMXeRPdngAAAAQQXr3iSA7j4WSLdYLQJngO1ocMWZ21jKGq+zdmfiqiBsK4eeBomdLvfrlZ61gMtqyCfVPYiz6jAckp08PrpPP1OX6WrmbwJFW0Mly9jeVH0HwO/2/cQ9wv8bkKJwBWWSg4nFWjVtmErlCFMHLrYTB5xxGr1sQrNsHsMtzbhnIa77LnZeGyRpT0rOfcDKyLIGbjxXpZ/0EB2yVO8GNpOn2B+29nGqhLZBhKry8UU6RUPhtuVHv6OOK/8MB/LPC/qVGCuLoCHOEu7THH4YW7C5EIvMXe+Hwy3NzexcczAzPyY=",
    },
}, function (err, res, body) {
    const bodyAsJson = JSON.parse(body);
    const gunStats = bodyAsJson.Response.displayProperties
    //let response = {Guns:{[itemHash]:{gunStats}}}
    let response = {[itemHash]:{gunStats}}
//response.itemHash = bodyAsJson.Response.displayProperties
 let Responsestring = JSON.stringify(response)
 let gunObject = JSON.stringify({"Guns": [response]})
 console.log(gunObject);
fs.writeFile("./Cache/ItemNameRequest.json", gunObject,{'flag':'a'}, function(err, result) {
    if(err) console.log('error', err);
});
});
 */
const credentials = require('./Config/config.json')
    console.log(credentials["ApiKey"])
