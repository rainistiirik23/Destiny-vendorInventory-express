const result = document.getElementById('result');
//const json = require('Cache/ItemNameRequest.json')
//console.log( json )
fetch('Cache/ItemNameManifest.json')
    .then(response => response.json())
    .then(data => {
        console.log(Object.keys(data['Guns']))
        const gunKeys = Object.keys(data['Guns'])
        for (let i = 0; i < gunKeys.length; i++) {
            /*  const itemRequestKey = Object.keys(data['Guns'][i]) */
            console.log(data["Guns"][gunKeys[i]]);
            const gunSalesFromFetch = data["Guns"][gunKeys[i]]["gunStats"]["name"];
            const gunIcons = data["Guns"][gunKeys[i]]["gunStats"]["icon"]
            const gunDiv = document.createElement('div');
            gunDiv.className = "gunDiv"
            result.appendChild(gunDiv)
            const gunIcon = document.createElement('img')
            gunIcon.src = `http://www.bungie.net${gunIcons}`;
            gunDiv.appendChild(gunIcon)
            const gunNameElement = document.createElement('span');
            gunDiv.appendChild(gunNameElement);
            const name = document.createTextNode(gunSalesFromFetch)
            gunNameElement.appendChild(name)
            console.log(data["Guns"][gunKeys[i]]["gunStats"]["perks"])
            for (let i2 = 0; i2 < data["Guns"][gunKeys[i]]["gunStats"]["perks"].length; i2++) {
                const perkIconElement = document.createElement('img')
                const perkIcon = data["Guns"][gunKeys[i]]["gunStats"]["perks"][i2]["icon"]
                console.log(perkIcon)
                perkIconElement.src = `http://www.bungie.net${perkIcon}`;
                gunDiv.appendChild(perkIconElement)
            }
        }
    });
