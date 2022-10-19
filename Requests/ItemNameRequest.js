
const request = require("request");

const fs = require('fs');
const credentials = require('../Config/config.json')
const { ApiKey } = credentials
const { access_token } = credentials
/*
When you make a VendorRequest,you get their inventory but item's have hashes instead of their actual names
and because of that we have to make a request that will tell us what the name the hash corresponds to.
When that's done we'll create a json file that contains a Gun property with a list of guns with their respective hashes followed by name and other data.
*/
const data = fs.readFileSync('Cache/VendorRequest.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    }
})
let itemHashList = [];
const gunSales = JSON.parse(data)['Response']['sales']['data'];
const salesKeys = Object.keys(gunSales);
let gunKeys = []
//console.log(salesKeys)
/*for (let i = 7; i <= 12; i++) {
    itemHashList.push(gunSales[salesKeys[i]]['itemHash'])
}*/
for (let i = 0; i <= 22; i++) {
    if (Object.hasOwn(gunSales[salesKeys[i]], 'costs') && gunSales[salesKeys[i]]['costs'].length == 2) {
        gunKeys.push(salesKeys[i])
        itemHashList.push(gunSales[salesKeys[i]]['itemHash']);
        console.log(salesKeys[i]);
    }
    else if (i == 22) {
        //console.log(itemHashList)
        console.log(gunKeys)
    }
}





//console.log(fetchItemHash())
//let itemHash =  "2272470786"

const timer = ms => new Promise(res => setTimeout(res, ms))
async function requestWithTimeout() {
    for (let i = 0; i <= 5; i++) {
        request.get({
            url: `https://www.bungie.net//Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${itemHashList[i]}/`,
            headers: {
                "X-API-KEY": ApiKey,
                "Authorization": access_token,
            },
        }, function (err, res, body) {
            const bodyAsJson = JSON.parse(body);
            const gunStats = bodyAsJson.Response.displayProperties
            //let response = {Guns:{[itemHash]:{gunStats}}}
            //let response = {[itemHashList[i]]:{gunStats}}
            let response = {
                gunStats
            }
            //response.itemHash = bodyAsJson.Response.displayProperties
            let Responsestring = JSON.stringify(response)
            let gunObject = JSON.stringify({ 'Guns': [{ [gunKeys[i]]: response }] })

            console.log(response);
            fs.readFile('Cache/ItemNameRequest.json', 'utf8', function (err, data) {
                if (data) {
                    console.log("true")
                    obj = JSON.parse(data)
                    obj['Guns'].push({ [gunKeys[i]]: response })
                    const json = JSON.stringify(obj)
                    //console.log(json)
                    fs.writeFile("Cache/ItemNameRequest.json", json, {
                        'flag': 'w'
                    }, function (err, result) {
                        if (err) console.log('error', err);
                    });
                } else if (!data) {
                    console.log("not true")
                    fs.writeFile("./Cache/ItemNameRequest.json", gunObject, {
                        'flag': 'a'
                    }, function (err, result) {
                        if (err) console.log('error', err);
                    });
                }
            });
        });
        await timer(4000);
    }
};
requestWithTimeout()
