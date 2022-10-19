const fs = require("fs")
const request = require("request");
const credentials = require('../Config/config.json')
const { ApiKey } = credentials
const { access_token } = credentials

const data = fs.readFileSync('Cache/PerkRequest.json', 'utf8', function (err, data) { })
const perkData = JSON.parse(data)["Response"]["itemComponents"]["perks"]["data"];
const perkKeys = Object.keys(perkData);
const vendorData = fs.readFileSync('Cache/VendorRequest.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    }
})
let itemHashList = [];
const gunSales = JSON.parse(vendorData)['Response']['sales']['data'];
const salesKeys = Object.keys(gunSales);
let gunKeys = [];
let gunPerkHashes = [];
/*for (let i = 0; i <= 22; i++) {
    if () {
        gunKeys.push(salesKeys[i])
        itemHashList.push(gunSales[salesKeys[i]]['itemHash']);
        //console.log(salesKeys[i]);
    } else if (i == 22) {
        //console.log(itemHashList)
        // console.log(gunKeys)
    }
}*/

for (let i = 0; i <= 22; i++) {
    if (Object.hasOwn(gunSales[salesKeys[i]], 'costs') && gunSales[salesKeys[i]]['costs'].length == 2) {
        gunKeys.push(salesKeys[i])
        itemHashList.push(gunSales[salesKeys[i]]['itemHash']);
        //console.log(salesKeys[i]);
    } else if (i == 22) {
        //console.log(itemHashList)
        // console.log(gunKeys)
    }
}
//console.log(gunKeys)

//console.log(perkKeys)
//console.log(gunKeys)
//console.log(perkData["Response"]["itemComponents"]["perks"]["data"][32]["perks"][2])
//console.log(perkData)
const timer = ms => new Promise(res => setTimeout(res, ms))
async function getPerkDefintion() {
    for (let i1 = 0; i1 < gunKeys.length; i1++) {
        if (perkData[gunKeys[i1]]) {
            //console.log(perkData[gunKeys[i]]["perks"].length)
        }
        for (let i = 0; i < perkData[gunKeys[i1]]["perks"].length; i++) {

            // console.log(body)
            if (perkData[gunKeys[i1]]["perks"][i]["iconPath"] && perkData[gunKeys[i1]]["perks"][i]["visible"]) {
                const perkHash = perkData[gunKeys[i1]]["perks"][i]["perkHash"]
                console.log(perkData[gunKeys[i1]]["perks"][i]["perkHash"]);
                request.get({
                    url: `https://www.bungie.net///Platform/Destiny2/Manifest/DestinySandboxPerkDefinition/${perkHash}/`,
                    headers: {
                        "X-API-KEY": ApiKey,
                        "Authorization": access_token,
                    },
                }, function (err, res, body) {
                    const perkDefinition = JSON.parse(body)["Response"]["displayProperties"];

                    fs.readFile("Test/ItemNameRequestTest.json", "utf8", function (err, data) {

                        const itemRequestAsJson = JSON.parse(data);
                        const gunIndex = gunKeys.indexOf(gunKeys[i1]);
                        //console.log(itemRequestAsJson["Guns"][gunIndex][gunKeys[i1]]["gunStats"]["name"])
                        if (!itemRequestAsJson["Guns"][gunIndex][gunKeys[i1]]["gunStats"]["perks"]) {
                            itemRequestAsJson["Guns"][gunIndex][gunKeys[i1]]["gunStats"]["perks"] = [perkDefinition]
                            //console.log(itemRequestAsJson["Guns"][gunIndex][gunKeys[i1]]["gunStats"]);

                            fs.writeFile("Test/ItemNameRequestTest.json", JSON.stringify(itemRequestAsJson), {
                                'flag': 'w'
                            }, function (err, result) {
                                if (err) console.log('error', err);
                            });
                        } else if (itemRequestAsJson["Guns"][gunIndex][gunKeys[i1]]["gunStats"]["perks"]) {
                            itemRequestAsJson["Guns"][gunIndex][gunKeys[i1]]["gunStats"]["perks"].push(perkDefinition) /
                                fs.writeFile("Test/ItemNameRequestTest.json", JSON.stringify(itemRequestAsJson), {
                                    'flag': 'w'
                                }, function (err, result) {
                                    if (err) console.log('error', err);
                                });
                        }
                    });
                });

            }

            // console.log(i)
            await timer(20000);
        }
        //console.log(perkData[perkKeys[i]]['perks'][1]["perkHash"])
        //console.log(perkData[perkKeys[i]]['perks'][2]["perkHash"])

    }
};
getPerkDefintion()
