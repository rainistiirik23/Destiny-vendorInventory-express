const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql');
const { Database:
    {
        host: host,
        user: databaseUser,
        password: password,
        database: dataBaseName
    }
} = require('../Config/config.json');
const getVendorManifest = () => {
    return (
        new Promise((resolve, reject) => {

            let db = new sqlite3.Database('dist/world_sql_content_50f67b17bc243f7570787a58395230db.content', sqlite3.OPEN_READWRITE, err => {
                if (err) {
                    reject(err.message);
                }
            });

            db.all(`SELECT json FROM DestinyVendorDefinition`, (error, result) => {

                if (error) {
                    reject(error);
                }

                else {

                    resolve(result);
                    db.close((error) => {
                        if (error) {

                            reject(error);

                        }

                        console.log('Close the database connection.');
                    });
                }
            });

        }));
}

const getVendorInfo = (manifest, ...vendorNames) => {
    return (
        new Promise((resolve, reject) => {
            if (!manifest || !vendorNames.length > 0) {
                reject("Cannot get vendor details from empty values")
            }
            const vendor = {
                Vendors: []
            }

            for (let i = 0; i < vendorNames.length; i++) {
                for (let j = 0; j < manifest.length; j++) {
                    const dataAsJson = JSON.parse(manifest[j]['json']);
                    const vendorData = dataAsJson['displayProperties'];
                    const name = vendorData['name'];
                    const description = vendorData['description'];
                    if (vendorData['name'] == vendorNames[i] && vendorData['mapIcon']) {

                        const vendorObject = {
                            name: name,
                            description: description
                        }

                        vendor['Vendors'].push(vendorObject);
                    }
                }
            }
            resolve(vendor);
        }));
}


const doesTableExist = mysqlConnection => {
    return (
        new Promise((resolve, reject) => {

            const doesTableExist = `DESCRIBE vendors;`;
            mysqlConnection.query(doesTableExist, (error, result) => {
                if (error && error.errno === 1146) {
                    console.log(error)
                    const createVendorTable = `CREATE TABLE Item_manifest (
                        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        description TEXT,
                        );`;

                    mysqlConnection.query(createVendorTable, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                    });
                }
                else {
                    console.log('found table')
                }

            })
            resolve();
        }))
}

const insertVendorData = (vendorInfo, mysqlConnection) => {
    return (
        new Promise((resolve, reject) => {

            const insertVendorDatasql = `INSERT INTO vendors(name, description) VALUES (?, ?);`;
            const vendorLength = vendorInfo['Vendors'].length;
            for (let i = 0; i < vendorLength; i++) {
                const vendorName = vendorInfo['Vendors'][i]['name'];
                const vendorDescription = vendorInfo['Vendors'][i]['description'];

                if (!vendorName || !vendorDescription) {
                    console.log('error: Cannot insert  empty value(s)');
                    continue;
                }

                const checkForDuplicates = `SELECT name FROM vendors WHERE EXISTS(SELECT name FROM vendors WHERE vendors.name = ?)`

                const duplicateExists = mysqlConnection.query(checkForDuplicates, [vendorName], (error, result) => {

                    if (error) {
                        reject(error);
                    }
                    console.log(result)
                })

                if (duplicateExists) {
                    console.log('Cannot insert duplicate value')
                    continue;
                }

                mysqlConnection.query(insertVendorDatasql, [vendorName, vendorDescription], (error, result) => {
                    if (error) {
                        reject(error);
                    }

                })

            }
            resolve();
        }))
}
const getVendor = async () => {

    const mysqlConnection = mysql.createConnection({
        host: host,
        user: databaseUser,
        password: password,
        database: dataBaseName
    });
    mysqlConnection.connect(error => {
        if (error) {
            throw error;
        }
    });
    try {
        const manifest = await getVendorManifest();
        const vendorInfo = await getVendorInfo(manifest, "Banshee-44", "Lord Shaxx");
        await doesTableExist(mysqlConnection);
        await insertVendorData(vendorInfo, mysqlConnection);
        mysqlConnection.end();

    }
    catch (error) {
        throw error;
    }
}
getVendor();
