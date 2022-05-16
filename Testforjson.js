const fs = require('fs');
const exampleData = {
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
