const fs = require('fs')
const fetch = require('node-fetch');
const path = require('path')

const itemManifest = JSON.parse(
    fs.readFileSync('./Cache/ItemNameManifest.json', 'utf-8', (error, result) => {
        if (error) {
            console.log(error)
        }
    }));

const gunKeys = Object.keys(itemManifest['Guns']);
const timer = ms => new Promise(resolve => setTimeout(resolve, ms));

const downloadFile = async () => {
    for (let i = 0; i < gunKeys.length; i++) {
        const gunId = gunKeys[i];
        const gunName = itemManifest['Guns'][gunId]['gunStats']['name'];
        const filePath = `./Server/Assets/Icons/Guns/${gunName}.png`;
        const iconPath = await itemManifest['Guns'][gunId]['gunStats']['icon'];
        const url = `https://www.bungie.net${iconPath}`;

        const res = await fetch(url);
        const fileStream = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });

        await timer(3000);
    }
};
downloadFile()
