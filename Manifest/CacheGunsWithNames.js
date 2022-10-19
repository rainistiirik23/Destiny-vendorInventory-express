const fs = require('graceful-fs');
const Vendordata = fs.readFileSync('Cache/VendorRequest.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    }
})

/* console.log(perkDataAsJson[2]) */
let itemHashList = [];
const gunSales = JSON.parse(Vendordata)['Response']['sales']['data'];
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
        /*     console.log(salesKeys[i]); */
    }
    else if (i == 22) {
        /*  console.log(itemHashList) */
        /*  console.log(gunKeys); */
    }
}
const Manifestdata = fs.readFileSync('Cache/ItemManifest.json', function (err, data) {
    /* console.log(data) */
    if (err) {
        console.log(err)
    }
});

const dataAsJson = JSON.parse(Manifestdata);
const getGunNames = () => {
    for (let i = 0; i < dataAsJson.length; i++) {
        const dataJson = JSON.parse(dataAsJson[i]['json']);
        const gunStats = dataJson.displayProperties;
        let response = {
            gunStats
        }

        for (let i = 0; i < itemHashList.length; i++) {
            if (JSON.parse(dataJson['hash'] == itemHashList[i])) {
                let gunObject = JSON.stringify({ 'Guns': { [gunKeys[i]]: response } })
                /* console.log(JSON.parse(gunObject)['Guns'][gunKeys[i]]); */
                /*  let gunObject = JSON.stringify({ 'Guns': [{ [gunKeys[i]]: response }] }) */
                const readManifest = fs.readFileSync('Cache/ItemNameManifest.json', 'utf8', function (err, data) {
                    if (!err) {
                        console.log("reading")
                    }
                });

                if (readManifest) {
                    const obj = JSON.parse(readManifest)
                    obj['Guns'][gunKeys[i]] = response;
                    const json = JSON.stringify(obj)

                    fs.writeFileSync('Cache/ItemNameManifest.json', json, {
                        'flag': 'w'
                    }, function (err, result) {
                        if (err) console.log('error', err);
                    });
                }
                if (!readManifest) {
                    /*    console.log("not true" + i) */
                    fs.writeFileSync('Cache/ItemNameManifest.json', gunObject, {
                        'flag': 'w'
                    }, function (err, result) {
                        if (err) console.log('error', err);
                    });
                }
            }
        }
    }
}
getGunNames();
