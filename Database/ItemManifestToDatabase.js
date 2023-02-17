const mysql = require('mysql');
const sqlite3 = require('sqlite3');
const { Database:
    {
        host: host,
        user: databaseUser,
        password: password,
        database: dataBaseName
    }
} = require('../Config/config.json');

const getItemManifest = async () => {
    let db = new sqlite3.Database('dist/world_sql_content_50f67b17bc243f7570787a58395230db.content', sqlite3.OPEN_READONLY, error => {
        if (error) {
            console.log(error)
        }
    });
    const itemManifest = await new Promise((resolve, reject) => {
        db.all('Select json from DestinyInventoryItemDefinition', (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
        /*  console.log(manifest); */
    })

    return itemManifest;
};

const insertData = async (mysqlConnection, manifest) => {

    for (let i = 0; i < manifest.length; i++) {

        const manifestAsJson = JSON.parse(manifest[i]['json']);
        const {
            displayProperties: { name: itemName, icon: itemIcon, },
            hash: itemHash,
            itemTypeDisplayName: itemTypeDisplayName,
            flavorText: itemFlavorText,
            itemTypeAndTierDisplayName: itemTypeAndTierDisplayName,
        } = manifestAsJson;
        const insertManifest = `INSERT INTO Item_manifest (itemName,itemIcon,itemHash,itemTypeDisplayName,itemFlavorText,itemTypeAndTierDisplayName) VALUES(?, ?, ?, ?, ?, ?);`;
        mysqlConnection.query(insertManifest,
            [
                itemName, itemIcon,
                itemHash, itemTypeDisplayName,
                itemFlavorText, itemTypeAndTierDisplayName

            ], (error, result) => {
                if (error) {
                    throw error;
                }
            });
    }
};

const manifestToDatabase = async () => {
    try {
        const manifest = await getItemManifest();

        const mysqlConnection = mysql.createConnection({
            host: host,
            user: databaseUser,
            password: password,
            database: dataBaseName
        });
        const describeManifest = `DESCRIBE Item_manifest;`;
        mysqlConnection.query(describeManifest, (error, result) => {
            if (error && error.errno === 1146) {
                console.log(error);
                const ItemManifestTable = `CREATE TABLE Item_manifest (
                        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                        itemName VARCHAR(255) NOT NULL,
                        itemIcon  TEXT,
                        itemHash BIGINT(255) NOT NULL,
                        itemTypeDisplayName VARCHAR(255) ,
                        itemFlavorText TEXT,
                        itemTypeAndTierDisplayName VARCHAR(255)
                        );`;

                mysqlConnection.query(ItemManifestTable, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(result);
                    }
                })
            }
            else {
                console.log("Table found");
            }
        })

        await insertData(mysqlConnection, manifest);
    }
    catch (error) {
        console.log(error)
    }
};
manifestToDatabase();
