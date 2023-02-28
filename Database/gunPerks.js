const mysql = require('mysql');
const fs = require('fs');
const { Database:
    {
        host: host,
        user: databaseUser,
        password: password,
        database: dataBaseName
    }
} = require('../Config/config.json');

const Perkdata = fs.readFileSync('Cache/PerkRequest.json', 'utf8', function (err, data) {
    if (err) {
        console.log(err)
    }
})
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

const getSalesKeys = mysqlConnection => {
    return (
        new Promise((resolve, reject) => {
            const salesKeysQuery = `SELECT itemSaleKey, id AS gun_id FROM gun_sales;`;
            mysqlConnection.query(salesKeysQuery, (error, result, fields) => {
                if (error) {
                    reject(error);
                }
                const salesKeyobject = {}
                for (let i = 0; i < result.length; i++) {
                    const { itemSaleKey: salesKey, gun_id: gunID } = result[i];
                    /* console.log(salesKey); */
                    const perkObject = { [salesKey]: { gunID: gunID } };
                    Object.assign(salesKeyobject, perkObject);
                }

                resolve(salesKeyobject);
            });
        }));
};

const getPerkInfo = salesKeys => {
    return (
        new Promise((resolve, reject) => {
            const perkObject = {}
            const perkDataAsJson = JSON.parse(Perkdata)['Response']['itemComponents']['perks']['data'];
            const objectKeys = Object.keys(salesKeys)


            for (let i = 0; i < objectKeys.length; i++) {
                const itemSaleKey = objectKeys[i];
                const perkObject = { perks: [] }
                Object.assign(salesKeys[itemSaleKey], perkObject)
                /*   console.log(itemSaleKey) */
                const salesPerksArray = perkDataAsJson[itemSaleKey]['perks'];
                for (let j = 0; j < salesPerksArray.length; j++) {
                    if (!salesPerksArray[j]['iconPath'] || !salesPerksArray[j]['visible']) {
                        continue;
                    }
                    const perk = salesPerksArray[j]
                    salesKeys[itemSaleKey]['perks'].push(perk)
                    /*  console.log(perk) */
                    /*  console.log(salesKeys[itemSaleKey]['perks']); */
                }
            }

            /*  console.log(salesKeys); */
            resolve(salesKeys);
        }));
}
const getPerkDefinitions = (mysqlConnection, perkInfo) => {

    return (
        new Promise((resolve, reject) => {
            const salesKeys = Object.keys(perkInfo);
            for (let i = 0; i < salesKeys.length; i++) {
                const salesKey = salesKeys[i];
                const perksArray = perkInfo[salesKey]['perks']
                for (let j = 0; j < perksArray.length; j++) {
                    const perkHash = perksArray[j]['perkHash']
                    const getPerKHashDefintion = `SELECT id as perkManifestID, perkName, perkDescription, perkHash FROM Perk_manifest WHERE perkHash = ?;`;

                    mysqlConnection.query(getPerKHashDefintion, perkHash, (error, result) => {
                        if (error) {
                            reject(error)
                        }
                        const {
                            perkManifestID: perkManifestID,
                            perkName: perkName,
                            perkDescription: perkDescription,
                            perkHash: perkHash,

                        } = result[0]
                        const databasePerkObject = {
                            perkManifestID: perkManifestID,
                            perkName: perkName,
                            perkDescription: perkDescription,
                            perkHash: perkHash,

                        }
                        const perkObject = perksArray[j]
                        Object.assign(perkObject, databasePerkObject)

                        /* console.log(result[0]) */
                        if (i === salesKeys.length - 1 && j === perksArray.length - 1) {
                            /*  console.log(perkInfo[41]['perks'][0]) */
                            resolve(perkInfo)
                        }

                    })
                }

            }
        }))
}
const checkForPerkTable = mysqlConnection => {
    return (
        new Promise((resolve, reject) => {
            const describePerks = `DESCRIBE gun_sales_perks;`;
            mysqlConnection.query(describePerks, (error, result) => {
                if (error) {
                    const makePerkTable = `CREATE TABLE gun_sales_perks (
                        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                        gunId INT NOT NULL,
                        perkHash BIGINT NOT NULL,
                        iconPath TEXT NOT NULL,
                        perkManifestID INT NOT NULL,
                        perkName VARCHAR(255) NOT NULL,
                        perkDescription TEXT NOT NULL
                        );`;

                    mysqlConnection.query(makePerkTable, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        resolve('made a perk table.')
                    })
                }
                resolve('perk table was found.')
            });

        }));
}
const insertPerkData = (mysqlConnection, perkInfo) => {
    return (
        new Promise((resolve, reject) => {
            const insertData = `INSERT INTO gun_sales_perks(gunId, perkHash, iconPath, perkManifestID, perkName, perkDescription) VALUES(?, ?, ?, ?, ?, ?);`;
            const perkInfoKeys = Object.keys(perkInfo);
            for (let i = 0; i < perkInfoKeys.length; i++) {
                const salesKey = perkInfoKeys[i]
                const perksArray = perkInfo[salesKey]['perks']
                const { gunID: gunId } = perkInfo[salesKey]
                for (let j = 0; j < perksArray.length; j++) {
                    const { perkHash, iconPath, perkManifestID, perkName, perkDescription } = perksArray[j]
                    console.log(perksArray[j])
                    mysqlConnection.query(insertData, [gunId, perkHash, iconPath, perkManifestID, perkName, perkDescription], (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        if (i === perkInfoKeys.length - 1 && j === perksArray.length - 1) {

                            resolve()
                        }
                    })

                }

            }
        }));
}

const perksToDataBase = async () => {

    try {
        const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
        const salesKeys = await getSalesKeys(mysqlConnection);
        const perkInfo = await getPerkInfo(salesKeys);
        const perksWithDefinitions = await getPerkDefinitions(mysqlConnection, perkInfo);
        console.log(perksWithDefinitions)
        await checkForPerkTable(mysqlConnection);
        await insertPerkData(mysqlConnection, perksWithDefinitions);
        await mysqlConnection.end();
    }
    catch (error) {
        throw error
    }
}
perksToDataBase();
