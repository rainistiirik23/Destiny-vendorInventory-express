const mysql = require('mysql');
const sqlite3 = require('sqlite3');
const { Database:
    {
        host: host,
        user: databaseUser,
        password: password,
        database: databaseName
    }
} = require('../Config/config.json');

const getPerkManifest = async () => {
    return (
        new Promise((resolve, reject) => {

            let db = new sqlite3.Database('dist/world_sql_content_50f67b17bc243f7570787a58395230db.content', sqlite3.OPEN_READONLY, error => {
                if (error) {
                    reject(error);
                }
            });

            db.all('Select json from DestinySandboxPerkDefinition', (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });

        }));
};

const createMysqlConnection = (host, databaseUser, password, databaseName) => {
    return (
        new Promise((resolve, reject) => {
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
        }));
}

const PerkTableCheck = mysqlConnection => {
    return (
        new Promise((resolve, reject) => {
            const describeManifestTable = `Describe Perk_manifest`
            mysqlConnection.query(describeManifestTable, (error, result) => {
                if (error && error.errno === 1146) {
                    console.log(error);
                    const PerkManifestTable = `CREATE TABLE Perk_manifest (
                        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                        perkName VARCHAR(255) NOT NULL,
                        perkDescription TEXT NOT NULL,
                        perkHash BIGINT(255) NOT NULL,
                        perkIcon VARCHAR(255) NOT NULL
                        );`;

                    mysqlConnection.query(PerkManifestTable, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        console.log(result);
                        resolve();
                    })
                }
                else {
                    console.log("Table found");
                    resolve();
                }
            })

        }))
}
const insertPerkData = async (mysqlConnection, manifest) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < manifest.length; i++) {
      const manifestAsJson = JSON.parse(manifest[i]["json"]);

      const {
        displayProperties: {
          description: perkDescription,
          name: perkName,
          icon: perkIcon,
        },
        hash: perkHash,
      } = manifestAsJson;

      const insertManifest = `INSERT INTO Perk_manifest ( perkName ,perkDescription ,perkHash,perkIcon) VALUES(?, ?, ?, ?);`;
      mysqlConnection.query(
        insertManifest,
        [perkName, perkDescription, perkHash, perkIcon],
        (error, result) => {
          if (error) {
            reject(error);
          }
        }
      );
      if (i === manifest.length - 1) {
        resolve();
      }
    }
  });
};

const manifestToDatabase = async () => {
    try {
        const manifest = await getPerkManifest();
        /* console.log(manifest) */
        const mysqlConnection = await createMysqlConnection(host, databaseUser, password, databaseName);
        await PerkTableCheck(mysqlConnection);
        await insertPerkData(mysqlConnection, manifest);
        await mysqlConnection.end();
    }
    catch (error) {
        console.log(error)
    }
};
manifestToDatabase();
