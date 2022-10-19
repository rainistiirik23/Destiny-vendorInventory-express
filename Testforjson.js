const fs = require('fs');
const Vendordata = fs.readFileSync('Cache/VendorRequest.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    }
})
const Perkdata = fs.readFileSync('Cache/PerkRequest.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    }
})
const perkDataAsJson = JSON.parse(Perkdata)['Response']['itemComponents']['perks']['data'];
/* console.log(perkDataAsJson[2]) */
let itemHashList = [];
const gunSales = JSON.parse(Vendordata)['Response']['sales']['data'];
const salesKeys = Object.keys(gunSales);
let gunKeys = []
/* console.log(salesKeys) */
/*for (let i = 7; i <= 12; i++) {
    itemHashList.push(gunSales[salesKeys[i]]['itemHash'])
}*/
for (let i = 0; i <= 22; i++) {
    if (Object.hasOwn(gunSales[salesKeys[i]], 'costs') && gunSales[salesKeys[i]]['costs'].length == 2) {
        gunKeys.push(salesKeys[i])
        itemHashList.push(gunSales[salesKeys[i]]['itemHash']);
        /*     console.log(salesKeys[i]); */
    }
    else if (i == 22) {
        /*  console.log(itemHashList) */
        console.log(gunKeys);
    }
}
const Manifestdata = fs.readFileSync('Cache/Manifest.json', function (err, data) {
    /* console.log(data) */
    if (err) {
        console.log(err)
    }
});
const perkManifestData = fs.readFile('Cache/PerkNameManifest.json', function (err, data) {
    const firstdataAsJson = JSON.parse(data);
    const secondDataAsJson = JSON.parse(firstdataAsJson[0]['json'])['displayProperties'];

    /*  console.log(secondDataAsJson) */
});
/* console.log(Manifestdata); */
const dataAsJson = JSON.parse(Manifestdata);

const dataWithoutString = JSON.parse(dataAsJson[0]['json']);
const timer = ms => new Promise(res => setTimeout(res, ms))

fs.readFile('Cache/PerkNameManifest.json', (err, data) => {
    /* const perkHash = perkDataAsJson[gunKeys[i1]]["perks"][i]["perkHash"] */
    const perkManifestJson = JSON.parse(data);
    const perkDataKeys = Object.keys(perkDataAsJson);
    /* console.log(perkDataKeys); */
    /* console.log(gunKeys[3]); */
    for (let i = 0; i < gunKeys.length; i++) {
        /* console.log(gunKeys[i]) */
        /*  console.log('loop 1' + '\t' + i) */
        /*  console.log(perkDataAsJson[gunKeys[i]]) */
        for (let i2 = 0; i2 < perkManifestJson.length; i2++) {
            const secondPerkManifestJson = JSON.parse(perkManifestJson[i2]['json']);
            /* console.log(secondPerkManifestJson); */
            /* console.log('loop 2' + '\t' + i) */

            /*  console.log(gunKeys[i] + '\t' + perkDataKeys[i] + '\t' + i) */

            if (perkDataAsJson[gunKeys[i]]) {
                /*    console.log(secondPerkManifestJson['hash']) */
                for (let i3 = 0; i3 < perkDataAsJson[gunKeys[i]]['perks'].length; i3++) {
                    if (perkDataAsJson[gunKeys[i]]['perks'][i3]['iconPath'] != false) {
                        /*   console.log('true') */
                    }
                    /*     console.log(i + '\t' + i2 + '\t' + i3) */
                    /*    console.log(i) */
                    /* console.log(perkDataAsJson[gunKeys[i]]['perks'][i3]['perkHash'] + '\t' + Object.hasOwn(perkDataAsJson[gunKeys[i]]['perks'][i3], 'iconPath')) */
                    /*  console.log(perkDataAsJson[gunKeys[i]]['perks'][i3]['iconPath']) */
                    if (perkDataAsJson[gunKeys[i]]['perks'][i3]['iconPath'] != false && secondPerkManifestJson['hash'] == perkDataAsJson[gunKeys[i]]['perks'][i3]['perkHash']) {
                        let manifestGunNames = fs.readFileSync('Cache/ItemNameManifest.json', (err, data) => {
                            if (err) {
                                console.log(err)
                            }
                        });

                        const itemManifestAsJSon = JSON.parse(manifestGunNames);
                        const itemManifestAsJSonSecond = JSON.parse(manifestGunNames);
                        /* const obj = itemManifestAsJSon['Guns'][gunKeys[i]]['gunStats']; */
                        /*  console.log(itemManifestAsJSon) */
                        /*   console.log(gunKeys[i]) */
                        /*  console.log(JSON.parse(manifestGunNames)['Guns'][gunKeys[i]]['gunStats']['perks']); */
                        if (itemManifestAsJSon['Guns'][gunKeys[i]]['gunStats']['perks']) {

                            itemManifestAsJSon['Guns'][gunKeys[i]]['gunStats']['perks'].push(secondPerkManifestJson['displayProperties']);
                            fs.writeFileSync('Cache/ItemNameManifest.json', JSON.stringify(itemManifestAsJSon), (err) => {
                                if (err) {
                                    console.log(err)
                                }
                            });
                        }
                        else if (!itemManifestAsJSon['Guns'][gunKeys[i]]['gunStats']['perks']) {
                            console.log(itemManifestAsJSonSecond)
                            itemManifestAsJSon['Guns'][gunKeys[i]]['gunStats']['perks'] = [secondPerkManifestJson['displayProperties']]
                            console.log(itemManifestAsJSonSecond)
                            fs.writeFileSync('Cache/ItemNameManifest.json', JSON.stringify(itemManifestAsJSon), (err) => {
                                if (err) {
                                    console.log(err)
                                }
                            });
                        }
                    }
                    var placeholder = 0;
                };
            }
        };

    };
});

for (let i1 = 0; i1 < gunKeys.length; i1++) {


    /* for (let i = 0; i < perkDataAsJson[gunKeys[i1]]["perks"].length; i++) {

        const perkHash = perkDataAsJson[gunKeys[i1]]["perks"][i]["perkHash"]
        if (perkDataAsJson[gunKeys[i1]]['perks'][i]['iconPath'] && perkDataAsJson[gunKeys[i1]]['perks'][i]['visible']) {
            fs.readFile('Cache/PerkNameManifest.json', (err, data) => {
                const perkJson = JSON.parse(data);
                console.log(perkJson[3000]);
            });
        }
    }; */
};
/*   const Testdata = JSON.parse(dataAsJson[0]['json']); */
/* console.log(Testdata['displayProperties']) */
//Getting names of guns from manifest
/* async function getGunNames() {
    for (let i = 0; i < dataAsJson.length; i++) {


        const dataJson = JSON.parse(dataAsJson[i]['json']);
        const gunStats = dataJson.displayProperties;

        let response = {
            gunStats
        }

        let Responsestring = JSON.stringify(response)

        for (let i = 0; i < itemHashList.length; i++) {

            if (JSON.parse(dataJson['hash'] == itemHashList[i])) {
                let gunObject = JSON.stringify({ 'Guns': [{ [gunKeys[i]]: response }] })

                const readManifest = fs.readFileSync('Cache/ItemNameManifest.json', 'utf8', function (err, data) {
                    if (!err) {
                        console.log("reading")

                    }
                });
                console.log(readManifest)

                if (readManifest) {
                    console.log('true')
                    const obj = JSON.parse(readManifest)
                    obj['Guns'].push({ [gunKeys[i]]: response })
                    const json = JSON.stringify(obj)

                    fs.writeFileSync('Cache/ItemNameManifest.json', json, {
                        'flag': 'w'
                    }, function (err, result) {
                        if (err) console.log('error', err);
                    });
                }
                if (!readManifest) {
                    console.log("not true" + i)
                    fs.writeFileSync('Cache/ItemNameManifest.json', gunObject, {
                        'flag': 'a'
                    }, function (err, result) {
                        if (err) console.log('error', err);
                    });

                }


            }
        }

    }
}
getGunNames();
 */
/*  console.log(data) */

/* const exampleData = {
    "gunStats": {
        "description": "",
        "name": "Perses-D",
        "icon": "/common/destiny2_content/icons/2d3e60f36d9355c7a3a99aaa972d934e.jpg",
        "hasIcon": true
    }
}
//console.log(exampleData['gunStats'])

const data = fs.readFileSync('Cache/VendorRequest.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    }
});

let itemHashList = [];
let gunKeyList = []
const gunSales = JSON.parse(data)['Response']['sales']['data'];
const gunKeys = Object.keys(gunSales);
for (let i = 7; i <= 12; i++) {
    itemHashList.push(gunSales[gunKeys[i]]['itemHash'])
    gunKeyList.push(gunKeys[i])
}
for (let i = 0; i <= 5; i++) {
    let gunObject = {
        "Guns": [{
            [gunKeyList[i]]: 'gun'

        }]
    }
    const jsonAsString = JSON.stringify(gunObject)
    fs.readFile('Test.json', 'utf8',function(err, data) {
        if(data){
            console.log(data)
        }
        fs.writeFile('Test.json',jsonAsString, {'flag': 'a'},function(err, data) {
if (err) {
    console.log(err)
}
        })

    })
}
 */
