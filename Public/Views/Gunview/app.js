


fetch('https://localhost:8000/banshee')
    .then(response => response.json())
    .then(data => {
        console.log('datafetch')
        console.log(Object.keys(data['Guns']))
        const gunKeys = Object.keys(data['Guns'])
        for (let i = 0; i < gunKeys.length; i++) {
            /*  const itemRequestKey = Object.keys(data['Guns'][i]) */
            console.log(data["Guns"][gunKeys[i]]);
            const gunNames = data["Guns"][gunKeys[i]]["gunStats"]["name"];
            const gunIcons = data["Guns"][gunKeys[i]]["gunStats"]["icon"]
            const gunsPerksDiv = document.createElement('div');
            const gunDiv = document.createElement('div');
            gunDiv.className = "gunDiv";
            gunsPerksDiv.className = "gunsPerksDiv";
            gunsPerksDiv.appendChild(gunDiv);
            result.appendChild(gunsPerksDiv);

            const gunIcon = document.createElement('img')
            gunIcon.src = `https://www.bungie.net${gunIcons}`;
            gunIcon.className = "gunIcon";
            gunDiv.appendChild(gunIcon);
            const gunNameElement = document.createElement('span');
            gunDiv.appendChild(gunNameElement);
            const gunName = document.createTextNode(gunNames);
            gunNameElement.appendChild(gunName);
            console.log(data["Guns"][gunKeys[i]]["gunStats"]["perks"]);
            for (let i2 = 0; i2 < data["Guns"][gunKeys[i]]["gunStats"]["perks"].length; i2++) {
                const perkDescription = data["Guns"][gunKeys[i]]["gunStats"]["perks"][i2]['description'];
                const perkDescriptionElement = document.createElement('p');
                const perkDescriptionText = document.createTextNode(perkDescription);
                perkDescriptionElement.appendChild(perkDescriptionText);
                const perkName = data["Guns"][gunKeys[i]]["gunStats"]["perks"][i2]['name'];
                const perkNameElement = document.createElement('span');
                const perkText = document.createTextNode(perkName);
                perkNameElement.appendChild(perkText);
                const perkDiv = document.createElement('div');
                gunsPerksDiv.appendChild(perkDiv);
                const perkIconElement = document.createElement('img');
                perkIconElement.className = 'perkIcon';
                const perkIcon = data["Guns"][gunKeys[i]]["gunStats"]["perks"][i2]["icon"];
                /* console.log(perkIcon); */
                perkIconElement.src = `https://www.bungie.net${perkIcon}`;
                perkDiv.appendChild(perkIconElement);
                perkDiv.appendChild(perkNameElement);
                perkDiv.appendChild(perkDescriptionElement);
            }
        }
    });

/* const fetchData = async () => {
    try {
        const url = 'http://localhost:8000/gunPic/';
        const gunFetch = await fetch(url);
        const gunsJson = await gunFetch.text();
        console.log(gunsJson);
        console.log('webfetch')
        return gunsJson;
    } catch (error) {
        console.log(error);
    }
}
fetchData(); */
