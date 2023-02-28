const fs = require('fs');
const { ApiKey, access_token } = require('../Config/config.json')
import fetch from 'node-fetch';
const { Database:
    {
        host: host,
        user: databaseUser,
        password: password,
        database: databaseName
    }
} = require('../Config/config.json');
const mysql = require('mysql');

const Vendordata = fs.readFileSync('Cache/VendorRequest.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    }
});

/* let itemHashList = [];
const gunSales = JSON.parse(Vendordata)['Response']['sales']['data'];
const salesKeys = Object.keys(gunSales);
let gunKeys = []
for (let i = 0; i < salesKeys.length; i++) {
    if (Object.hasOwn(gunSales[salesKeys[i]], 'costs') && gunSales[salesKeys[i]]['costs'].length == 2) {
        gunKeys.push(salesKeys[i]);
        itemHashList.push(gunSales[salesKeys[i]]['itemHash']);

    }
} */

const createMysqlConnection = (host, databaseUser, password, databaseName) => {
    return new Promise((resolve, reject) => {
        const mysqlConnection = mysql.createConnection(
            {
                host: host,
                user: databaseUser,
                password: password,
                database: databaseName
            });

        mysqlConnection.connect(error => {
            if (error) {
                reject(error);
            }
        })
        resolve(mysqlConnection);
    })
}
const getItemHashList = vendorData => {
    return (
        new Promise((resolve, reject) => {
            if (vendorData) {
                reject('Did not find vendorData');
            }
            let itemHashList = [];
            const gunSales = JSON.parse(Vendordata)['Response']['sales']['data'];
            const salesKeys = Object.keys(gunSales);
            let gunKeys = []
            for (let i = 0; i < salesKeys.length; i++) {
                if (Object.hasOwn(gunSales[salesKeys[i]], 'costs') && gunSales[salesKeys[i]]['costs'].length == 2) {
                    gunKeys.push(salesKeys[i]);
                    itemHashList.push(gunSales[salesKeys[i]]['itemHash']);
                    /*     console.log(salesKeys[i]); */
                }
                resolve(itemHashList);
            }

        }));

}

const getVendorID = (mysqlConnection, name) => {
    return (
        new Promise((resolve, reject) => {

            const getIDFromDatabse = `SELECT * FROM vendors WHERE name=?;`;
            const vendorObject = { Vendors: {} };
            mysqlConnection.query(getIDFromDatabse, [name], (error, result) => {
                if (error) {
                    reject(error);

                }
                /*    console.log(result) */
                const id = result[0]['id']
                const name = result[0]['name']
                const vendor = {
                    id: id,
                    name: name
                }
                Object.assign(vendorObject['Vendors'], vendor);
                resolve(vendorObject);
            });
        }));
}
const getGunInfo = async (mysqlConnection, itemHashList) => {
    return (
        new Promise(async (resolve, reject) => {
            const gunInfoFromDatabse = `SELECT * FROM Item_manifest WHERE itemHash=?;`;
            let gunInfo = {}


            for (let i = 0; i < itemHashList.length; i++) {

                const gunHash = itemHashList[i];
                const query = await mysqlConnection.query(gunInfoFromDatabse, [gunHash], (error, result) => {
                    /*   console.log(i + ' callback') */
                    if (error) {
                        reject(error);
                    }

                    const gunResult = result[0];
                    const gunObject = {
                        [i]: {
                            id: gunResult['id'],
                            itemName: gunResult['itemName'],
                            itemIcon: gunResult['itemIcon'],
                            itemHash: gunResult['itemHash'],
                            itemTypeDisplayName: gunResult['itemTypeDisplayName'],
                            itemFlavorText: gunResult['itemFlavorText'],
                            itemTypeAndTierDisplayName: gunResult['itemTypeAndTierDisplayName'],
                            itemSaleKey: gunKeys[i]
                        }
                    };
                    Object.assign(gunInfo, gunObject)
                    if (i === itemHashList.length - 1) {
                        resolve(gunInfo);
                    }
                });

            }

        }));
};
const insertGuns = (mysqlConnection, vendorID, gunInfo) => {
    return (
        new Promise((resolve, reject) => {

            const describeManifest = `DESCRIBE gun_sales;`;

            mysqlConnection.query(describeManifest, (error, result) => {
                if (error && error.errno === 1146) {
                    console.log(error);

                    const gunSalesTable = `CREATE TABLE gun_sales (
                             id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                             vendorId INT,
                             itemManifestID INT,
                             itemName VARCHAR(255) NOT NULL,
                             itemIcon  TEXT,
                             itemHash BIGINT(255) NOT NULL,
                             itemTypeDisplayName VARCHAR(255) ,
                             itemFlavorText TEXT,
                             itemTypeAndTierDisplayName VARCHAR(255),
                             itemSaleKey INT NOT NULL UNIQUE
                             );`;

                    mysqlConnection.query(gunSalesTable, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                    });
                }
                const gunInfoKeys = Object.keys(gunInfo);
                for (let i = 0; i < gunInfoKeys.length; i++) {
                    const {
                        id: itemManifestId,
                        itemName: itemName,
                        itemIcon: itemIcon,
                        itemHash: itemHash,
                        itemTypeDisplayName: itemTypeDisplayName,
                        itemFlavorText: itemFlavorText,
                        itemTypeAndTierDisplayName: itemTypeAndTierDisplayName,
                        itemSaleKey: itemSaleKey
                    } = gunInfo[i]
                    /*  console.log(vendorID['Vendors']['id']); */
                    const insertGunInfo = `INSERT INTO gun_sales (vendorId, itemManifestID, itemName, itemIcon, itemHash, itemTypeDisplayName, itemFlavorText, itemTypeAndTierDisplayName,itemSaleKey) VALUES(?, ?, ?, ?, ?, ?, ?, ?,?);`;

                    mysqlConnection.query(insertGunInfo,
                        [
                            vendorID['Vendors']['id'],
                            itemManifestId,
                            itemName,
                            itemIcon,
                            itemHash,
                            itemTypeDisplayName,
                            itemFlavorText,
                            itemTypeAndTierDisplayName,
                            itemSaleKey

                        ],
                        (error, result) => {
                            if (error) {
                                reject(error)
                            }

                            if (i === gunInfoKeys.length - 1) {
                                resolve();
                            }
                        });


                }
            });
        }));
};
const getGunSales = async name => {
    try {
        const vendorData = await fetch(
            'https://www.bungie.net//Platform/Destiny2/2/Profile/4611686018436313974/Character/2305843009261697780/Vendors/672118013/?components=402', {
            "X-API-KEY": ApiKey,
            "Authorization": "Bearer " + access_token,

        }

        )
        const vendorDataAsJson = await vendorData.json();
        const itemHashList = await getItemHashList(vendorData);
        console.log(itemHashList);
        /*  const mysqlConnection = await createMysqlConnection(host, databaseUser, password, databaseName);
        const vendorID = await getVendorID(mysqlConnection, name);
        const gunInfo = await getGunInfo(mysqlConnection, itemHashList)
         console.log(gunInfo);
        await insertGuns(mysqlConnection, vendorID, gunInfo);
        await mysqlConnection.end((error, result) => {
            if (error) {
                throw error;
            }
        }); */


    }
    catch (error) {

        throw error

    }
}
getGunSales("Banshee-44");
