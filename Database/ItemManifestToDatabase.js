const mysql = require("mysql");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const {
  Database: { host: host, user: databaseUser, password: password, dataBaseName: dataBaseName },
} = require("../Config/config.json");

const getItemManifest = async () => {
  let db = new sqlite3.Database(
    "dist/world_sql_content_14e4321b227a904753480705bc9a3651.content",
    sqlite3.OPEN_READONLY,
    (error) => {
      if (error) {
        /*  console.log(error); */
      }
    }
  );
  const itemManifest = await new Promise((resolve, reject) => {
    db.all("Select json from DestinyInventoryItemDefinition", (error, result) => {
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
                              itemDescription TEXT,
                              itemIcon  TEXT,
                              itemHash BIGINT(255) NOT NULL,
                              itemTypeDisplayName TEXT,
                              itemFlavorText TEXT,
                              itemTypeAndTierDisplayName VARCHAR(255),
                              plug_category_identifier VARCHAR(255)
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
      /*  if (manifestAsJson.hash === 3511092054) {
        console.log(manifestAsJson);
      } */
      const {
        displayProperties: { name: itemName, description, icon: itemIcon },
        hash: itemHash,
        itemTypeDisplayName: itemTypeDisplayName,
        flavorText: itemFlavorText,
        itemTypeAndTierDisplayName: itemTypeAndTierDisplayName,
        plug: { plugCategoryIdentifier = null } = {},
      } = manifestAsJson;
      const insertManifest = `INSERT INTO Item_manifest (itemName,itemDescription,itemIcon,itemHash,itemTypeDisplayName,itemFlavorText,itemTypeAndTierDisplayName,plug_category_identifier) VALUES(?, ?, ?, ?, ?, ?, ?,?);`;
      mysqlConnection.query(
        insertManifest,
        [
          itemName,
          description,
          itemIcon,
          itemHash,
          itemTypeDisplayName,
          itemFlavorText,
          itemTypeAndTierDisplayName,
          plugCategoryIdentifier,
        ],
        (error, result) => {
          /*  if (manifestAsJson.hash === 3511092054) {
            console.log(error);
          } */
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

    const mysqlConnection = mysql.createConnection({
      host: host,
      user: databaseUser,
      password: password,
      database: dataBaseName,
    });

    const describeManifest = `DESCRIBE Item_manifest;`;
    await doesItemManifestTableExist(describeManifest, mysqlConnection);
    await insertData(mysqlConnection, manifest);
    endMysqlConnection(mysqlConnection);
  } catch (error) {
    console.log(error);
  }
};
manifestToDatabase();
