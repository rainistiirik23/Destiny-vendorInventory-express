const mysql = require("mysql");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const {
  Database: { host: host, user: databaseUser, password: password, dataBaseName: dataBaseName },
} = require("../../Config/config.json");
const getmanifestFileName = () => {
  return new Promise((resolve, reject) => {
    fs.readdir("Server/Storage/Manifest/WorldContent", (error, files) => {
      if (error) {
        console.error(error);
        reject(error);
        return;
      }
      const manifestFileName = files.find((file) => file.includes("world_sql_content"));
      resolve(manifestFileName);
    });
  });
};
const getItemManifest = async (manifestFileName) => {
  let db = new sqlite3.Database(
    `Server/Storage/Manifest/WorldContent/${manifestFileName}`,
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
        }
      } else {
        console.log("Table found, truncating table and adding new data.");
        mysqlConnection.query("Truncate table Item_manifest", (error, result) => {
          console.error(error);
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
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
    const manifestFileName = await getmanifestFileName();
    const manifest = await getItemManifest(manifestFileName);
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
module.exports = manifestToDatabase;
