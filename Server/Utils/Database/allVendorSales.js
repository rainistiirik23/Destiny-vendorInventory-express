const mysql = require("mysql");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const {
  Database: { host: host, user: databaseUser, password: password, dataBaseName: dataBaseName },
} = require("../../Config/config.json");
const createMysqlConnection = (host, databaseUser, password, databaseName) => {
  return new Promise((resolve, reject) => {
    const mysqlConnection = mysql.createConnection({
      host: host,
      user: databaseUser,
      password: password,
      database: databaseName,
    });

    mysqlConnection.connect((error) => {
      if (error) {
        reject(error);
      }
    });
    resolve(mysqlConnection);
  });
};
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
const getInventoryItemDefinitions = (manifestFileName) => {
  return new Promise((resolve, reject) => {
    const manifest = new sqlite3.Database(
      `Server/Storage/Manifest/WorldContent/${manifestFileName}`,
      sqlite3.OPEN_READONLY,
      (error) => {
        if (error) {
          reject(error);
        }
      }
    );
    manifest.all("Select json from DestinyInventoryItemDefinition", (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};
const getPlugSetDefinitions = (manifestFileName) => {
  return new Promise((resolve, reject) => {
    const manifest = new sqlite3.Database(
      `Server/Storage/Manifest/WorldContent/${manifestFileName}`,
      sqlite3.OPEN_READONLY,
      (error) => {
        if (error) {
          reject(error);
        }
      }
    );
    manifest.all("Select json from DestinyPlugSetDefinition", (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};
const getSocketDefinitions = (manifestFileName) => {
  return new Promise((resolve, reject) => {
    const manifest = new sqlite3.Database(
      `Server/Storage/Manifest/WorldContent/${manifestFileName}`,
      sqlite3.OPEN_READONLY,
      (error) => {
        if (error) {
          reject(error);
        }
      }
    );
    manifest.all("Select json from DestinySocketTypeDefinition", (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};
const getStatDefinitions = (manifestFileName) => {
  return new Promise((resolve, reject) => {
    const manifest = new sqlite3.Database(
      `Server/Storage/Manifest/WorldContent/${manifestFileName}`,
      sqlite3.OPEN_READONLY,
      (error) => {
        if (error) {
          reject(error);
        }
      }
    );
    manifest.all("Select json from DestinyStatDefinition", (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};
const getVendorInfo = (manifestFileName) => {
  return new Promise((resolve, reject) => {
    const manifest = new sqlite3.Database(
      `Server/Storage/Manifest/WorldContent/${manifestFileName}`,
      sqlite3.OPEN_READONLY,
      (error) => {
        if (error) {
          reject(error);
        }
      }
    );
    manifest.all("Select json from DestinyVendorDefinition", (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const getAllPossibleVendorSales = (
  vendorManifest,
  itemDefintionsManifest,
  socketTypeDefinitions,
  plugSetDefinitions,
  statDefinitions
) => {
  return new Promise((resolve, reject) => {
    const allVendorGunsales = [];
    const itemDefintionsManifestLength = itemDefintionsManifest.length;
    const vendorManifestLength = vendorManifest.length;
    for (let i = 0; i < vendorManifestLength; i++) {
      if (JSON.parse(vendorManifest[i].json).hash === 672118013) {
        const vendorItemList = JSON.parse(vendorManifest[i].json).itemList;
        for (let j = 0; j < vendorItemList.length; j++) {
          if (vendorItemList[j].displayCategory === "Featured") {
            allVendorGunsales.push(vendorItemList[j]);
          }
        }
        break;
      }
    }
    allVendorGunsales.forEach((saleItem, saleItemIndex) => {
      for (let i = 0; i < itemDefintionsManifestLength; i++) {
        const itemDefinitionAsJson = JSON.parse(itemDefintionsManifest[i].json);
        /* console.log(itemDefinitionAsJson); */
        if (saleItem.itemHash === itemDefinitionAsJson.hash) {
          saleItem.itemName = itemDefinitionAsJson.displayProperties.name;
          saleItem.itemFlavorText = itemDefinitionAsJson.flavorText;
          saleItem.statGroupHash = itemDefinitionAsJson.stats.statGroupHash;
          saleItem.masterWorkSocket = itemDefinitionAsJson.sockets.socketEntries.find((socketEntry) => {
            return socketEntry.socketTypeHash === 2218962841;
          });
          saleItem.itemTypeDisplayName = itemDefinitionAsJson.itemTypeDisplayName;
          saleItem.itemTypeAndTierDisplayName = itemDefinitionAsJson.itemTypeAndTierDisplayName;
          saleItem.itemIcon = itemDefinitionAsJson.displayProperties.icon;
          saleItem.perkPlugSetHashes = [];
          saleItem.perks = {};
          saleItem.stats = [];
          saleItem.masterWorks = [];
          const socketEntries = itemDefinitionAsJson.sockets.socketEntries;
          const statKeys = Object.keys(itemDefinitionAsJson.stats.stats);
          /* console.log(Object.keys(itemDefinitionAsJson.stats.stats)); */
          statKeys.forEach((statKey) => {
            const statHash = itemDefinitionAsJson.stats.stats[statKey].statHash;
            statDefinitions.forEach((statDefinition) => {
              if (JSON.parse(statDefinition.json).hash === statHash) {
                const statObject = {};
                statObject.statName = JSON.parse(statDefinition.json).displayProperties.name;
                statObject.description = JSON.parse(statDefinition.json).displayProperties.description;
                statObject.description = JSON.parse(statDefinition.json).displayProperties.description;
                statObject.statValue = itemDefinitionAsJson.stats.stats[statKey].value;
                saleItem.stats.push(statObject);
                return;
              }
            });
          });
          for (let j = 0; j < socketEntries.length; j++) {
            for (let k = 0; k < socketTypeDefinitions.length; k++) {
              const socketTypeDefinitionsAsJson = JSON.parse(socketTypeDefinitions[k].json);
              /*     console.log(saleItem.itemName); */
              if (
                socketEntries[j].socketTypeHash === socketTypeDefinitionsAsJson.hash &&
                socketEntries[j].randomizedPlugSetHash &&
                socketTypeDefinitionsAsJson.socketCategoryHash === 4241085061
              ) {
                /*  console.log("condition met: perks", saleItemIndex); */
                saleItem.perks[`perkColumn${j}`] = [];

                plugSetDefinitions.forEach((plugSetDefinition, index) => {
                  const plugSetDefinitionAsJson = JSON.parse(plugSetDefinition.json);
                  if (plugSetDefinitionAsJson.hash === socketEntries[j].randomizedPlugSetHash) {
                    plugSetDefinitionAsJson.reusablePlugItems.forEach((reusablePlugItem) => {
                      for (let l = 0; l < itemDefintionsManifestLength; l++) {
                        const itemDefinition = JSON.parse(itemDefintionsManifest[l].json);
                        if (itemDefinition.hash === reusablePlugItem.plugItemHash) {
                          const perkObject = {};
                          perkObject.perkName = itemDefinition.displayProperties.name;
                          perkObject.perkDescription = itemDefinition.displayProperties.description;
                          perkObject.perkIcon = itemDefinition.displayProperties.icon;
                          perkObject.perkHash = itemDefinition.hash;
                          saleItem.perks[`perkColumn${j}`].push(perkObject);
                          break;
                        }
                      }
                    });
                    return;
                  }
                });
                saleItem.perkPlugSetHashes.push(socketEntries[j].randomizedPlugSetHash);
                break;
              } else if (
                socketEntries[j].socketTypeHash === socketTypeDefinitionsAsJson.hash &&
                socketEntries[j].socketTypeHash === 2218962841
              ) {
                /* console.log("condition met: masterwork", saleItemIndex); */
                plugSetDefinitions.forEach((plugSetDefinition, index) => {
                  const plugSetDefinitionAsJson = JSON.parse(plugSetDefinition.json);
                  if (plugSetDefinitionAsJson.hash === socketEntries[j].reusablePlugSetHash) {
                    plugSetDefinitionAsJson.reusablePlugItems.forEach((reusablePlugItem) => {
                      for (let l = 0; l < itemDefintionsManifestLength; l++) {
                        const itemDefinition = JSON.parse(itemDefintionsManifest[l].json);
                        if (itemDefinition.hash === reusablePlugItem.plugItemHash) {
                          const masterWorkObject = {};
                          masterWorkObject.masterWorkName = itemDefinition.displayProperties.name;
                          masterWorkObject.masterWorkDescription = itemDefinition.displayProperties.description;
                          masterWorkObject.masterWorkIcon = itemDefinition.displayProperties.icon;
                          masterWorkObject.masterWorkHash = itemDefinition.hash;
                          saleItem.masterWorks.push(masterWorkObject);
                          break;
                        }
                      }
                    });
                    return;
                  }
                });
                break;
              }
            }
          }

          console.log(JSON.stringify(saleItem.stats));
          break;
        }
      }
      /*   console.log(saleItem.masterWorks); */
    });

    resolve(allVendorGunsales);
  });
};
const getVendorID = (mysqlConnection, name) => {
  return new Promise((resolve, reject) => {
    const getIDFromDatabse = `SELECT * FROM vendors WHERE name=?;`;
    const vendorObject = { Vendors: {} };
    mysqlConnection.query(getIDFromDatabse, [name], (error, result) => {
      if (error) {
        reject(error);
      }
      console.log(result[0].id);

      resolve(result[0].id);
    });
  });
};

const createAllVendorSalesTable = (mysqlConnection) => {
  return new Promise((resolve, reject) => {
    const describeTableQuery = "DESCRIBE allVendorSales";
    mysqlConnection.query(describeTableQuery, (error, result) => {
      if (error) {
        if (error.errno === 1146) {
          console.log(error);
          const createTableQuery = `CREATE TABLE allVendorSales(
            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            item_name VARCHAR(255) NOT NULL,
            item_icon  TEXT,
            item_hash BIGINT(255) NOT NULL,
            item_type_display_name VARCHAR(255),
            item_flavorText TEXT,
            item_type_and_tier_display_name VARCHAR(255),
            stats TEXT NOT NULL,
            perks TEXT NOT NULL,
            masterworks TEXT NOT NULL,
            vendor_id INT NOT NULL)`;
          mysqlConnection.query(createTableQuery, (error, result) => {
            if (error) {
              reject(error);
            }
            resolve();
          });
        }
      } else {
        console.log("Table found, truncating table and adding new data.");
        mysqlConnection.query("Truncate table allVendorSales", (error, result) => {
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
const insertAllVendorSalesData = (mysqlConnection, vendorSales, vendorId) => {
  return new Promise((resolve, reject) => {
    vendorSales.forEach((saleItem) => {
      const {
        itemName,
        itemIcon,
        itemHash,
        itemFlavorText,
        itemTypeDisplayName,
        itemTypeAndTierDisplayName,
        stats,
        perks,
        masterWorks,
      } = saleItem;
      const instertDataQuery = `INSERT INTO allVendorSales (item_name,item_icon,item_hash,item_type_display_name,item_flavorText,item_type_and_tier_display_name,stats,perks,masterworks,vendor_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?,?);`;
      /* console.log(statGroupHash); */
      mysqlConnection.query(
        instertDataQuery,
        [
          itemName,
          itemIcon,
          itemHash,
          itemTypeDisplayName,
          itemFlavorText,
          itemTypeAndTierDisplayName,
          JSON.stringify(stats),
          JSON.stringify(perks),
          JSON.stringify(masterWorks),
          vendorId,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          console.log(result);
        }
      );
    });
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
const allVendorSales = async () => {
  try {
    const manifestFileName = await getmanifestFileName();
    const ItemDefinitions = await getInventoryItemDefinitions(manifestFileName);
    const socketDefinitions = await getSocketDefinitions(manifestFileName);
    const plugSetDefinitions = await getPlugSetDefinitions(manifestFileName);
    const statDefinitions = await getStatDefinitions(manifestFileName);
    const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
    const vendorInfo = await getVendorInfo(manifestFileName);
    const vendorId = await getVendorID(mysqlConnection, "Banshee-44");
    const vendorSales = await getAllPossibleVendorSales(
      vendorInfo,
      ItemDefinitions,
      socketDefinitions,
      plugSetDefinitions,
      statDefinitions
    );
    /* console.log(vendorSales); */
    await createAllVendorSalesTable(mysqlConnection);
    await insertAllVendorSalesData(mysqlConnection, vendorSales, vendorId);
    await endMysqlConnection(mysqlConnection);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
/* allVendorSales(); */
module.exports = allVendorSales;
// Itemdisplayname,DestinyItemSourceBlockDefinition,itemCategoryHashes,itemType,DestinyVendorDefinition
