const mysql = require("mysql");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const {
  Database: { host: host, user: databaseUser, password: password, database: dataBaseName },
} = require("../../../Config/config.json");

const getItemManifest = async () => {
  let db = new sqlite3.Database(
    "dist/world_sql_content_14e4321b227a904753480705bc9a3651.content",
    sqlite3.OPEN_READONLY,
    (error) => {
      if (error) {
        console.log(error);
      }
    }
  );
  const itemManifest = await new Promise((resolve, reject) => {
    db.all("Select json from DestinyVendorDefinition", (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
    /*  console.log(manifest); */
  });

  return itemManifest;
};
const doesItemManifestTableExist = (manifestDescription, mysqlConnection) => {
  return new Promise((resolve, reject) => {
    mysqlConnection.query(manifestDescription, (error, result) => {
      if (error) {
        if (error.errno === 1146) {
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
              reject(error);
            } else {
              console.log(result);
              resolve();
            }
          });
        } else if (error.errno !== 1146) {
          console.log(error);
          reject(error);
        }
      } else {
        console.log("Table found");
        resolve();
      }
    });
  });
};
const insertData = async (mysqlConnection, manifest) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < manifest.length; i++) {
      const manifestAsJson = JSON.parse(manifest[i]["json"]);
      const {
        displayProperties: { name: itemName, icon: itemIcon },
        hash: itemHash,
        itemTypeDisplayName: itemTypeDisplayName,
        flavorText: itemFlavorText,
        itemTypeAndTierDisplayName: itemTypeAndTierDisplayName,
      } = manifestAsJson;
      const insertManifest = `INSERT INTO Item_manifest (itemName,itemIcon,itemHash,itemTypeDisplayName,itemFlavorText,itemTypeAndTierDisplayName) VALUES(?, ?, ?, ?, ?, ?);`;
      mysqlConnection.query(
        insertManifest,
        [itemName, itemIcon, itemHash, itemTypeDisplayName, itemFlavorText, itemTypeAndTierDisplayName],
        (error, result) => {
          if (error) {
            reject(error);
          }
        }
      );
    }
    resolve();
  });
};
const endMysqlConnection = (mysqlConnection) => {
  return new Promise((resolve, reject) => {
    mysqlConnection.end((error) => {
      if (error) {
        reject(error);
      }
      console.log("closed mysql connection");
      resolve();
    });
  });
};
const manifestToDatabase = async () => {
  try {
    const manifest = await getItemManifest();
    for (let i = 0; i < manifest.length; i++) {
      if (JSON.parse(manifest[i].json).hash === 672118013) {
        console.log(JSON.parse(manifest[i].json));
        /*   console.log(manifest[i]); */
        break;
      }
    }

    /*  const mysqlConnection = mysql.createConnection({
      host: host,
      user: databaseUser,
      password: password,
      database: dataBaseName,
    }); */

    /*  const describeManifest = `DESCRIBE Item_manifest;`;
    await doesItemManifestTableExist(describeManifest, mysqlConnection);
    await insertData(mysqlConnection, manifest); */
    /*  endMysqlConnection(mysqlConnection); */
  } catch (error) {
    console.log(error);
  }
};
manifestToDatabase();

// Itemdisplayname,DestinyItemSourceBlockDefinition,itemCategoryHashes,itemType,DestinyVendorDefinition
