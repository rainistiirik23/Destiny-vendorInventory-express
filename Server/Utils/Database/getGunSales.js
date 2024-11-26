const fs = require("fs");
const {
  /*  ApiKey, access_token  */
} = require("../../Config/config.json");
const fetch = require("node-fetch");
const {
  Api: { ApiKey, access_token },
  SteamAccount: { memberShipType, memberShipId, characterId },
  Database: { host: host, user: databaseUser, password: password, dataBaseName: dataBaseName },
} = require("../../Config/config.json");
const mysql = require("mysql");

const createMysqlConnection = (host, databaseUser, password, dataBaseName) => {
  return new Promise((resolve, reject) => {
    const mysqlConnection = mysql.createConnection({
      host: host,
      user: databaseUser,
      password: password,
      database: dataBaseName,
    });

    mysqlConnection.connect((error) => {
      if (error) {
        reject(error);
      }
    });
    resolve(mysqlConnection);
  });
};
const getVendorData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Server/Storage/Request/vendorRequest.json", "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};
const getVendorPerkData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Server/Storage/PerkRequest.json", "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
const getItemHashList = (vendorData) => {
  return new Promise((resolve, reject) => {
    if (!vendorData) {
      reject("Did not find vendorData");
    }
    let itemsList = [];
    const gunSales = vendorData["Response"]["sales"]["data"];
    const salesKeys = Object.keys(gunSales);
    let gunKeys = [];
    for (let i = 0; i < salesKeys.length; i++) {
      if (Object.hasOwn(gunSales[salesKeys[i]], "costs") && gunSales[salesKeys[i]]["costs"].length == 2) {
        const saleObject = {
          saleKey: salesKeys[i],
          itemHash: gunSales[salesKeys[i]]["itemHash"],
        };
        /* gunKeys.push(salesKeys[i]); */
        itemsList.push(saleObject);
        /*     console.log(salesKeys[i]); */
      }
    }
    resolve(itemsList);
  });
};
const getAllItems = (mysqlConnection) => {
  return new Promise((resolve, reject) => {
    mysqlConnection.query(`Select * from Item_manifest`, (error, results, fields) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
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
      /*    console.log(result); */
      const id = result[0]["id"];
      const name = result[0]["name"];
      const vendor = {
        id: id,
        name: name,
      };
      Object.assign(vendorObject["Vendors"], vendor);
      resolve(vendorObject);
    });
  });
};
const getGunInfo = (items, vendorData, allItems) => {
  return new Promise(async (resolve, reject) => {
    /*  console.log(allItems); */
    const itemHashQuery = `SELECT * FROM Item_manifest WHERE itemHash=?;`;
    const perkQuery = `SELECT * FROM Perk_manifest WHERE perkHash=?;`;
    let gunInfo = [];
    console.log(vendorData.Response.itemComponents);

    const itemsPlugDataAsJson = vendorData.Response.itemComponents.reusablePlugs.data;
    const socketDataAsJson = vendorData.Response.itemComponents.sockets.data;
    /*   console.log(socketDataAsJson); */
    for (let i = 0; i < items.length; i++) {
      const gunHash = items[i].itemHash;
      const saleKey = items[i].saleKey;
      const matchedItem = allItems.find((item) => {
        if (item.itemTypeAndTierDisplayName?.includes("Material")) {
          return;
        }
        return item.itemHash === items[i].itemHash;
      });
      if (!matchedItem) {
        continue;
      }
      console.log(matchedItem, saleKey);

      matchedItem.perks = {};
      matchedItem.itemSaleKey = saleKey;
      matchedItem.masterWork = {};
      const plugsArrayKeys = Object.keys(itemsPlugDataAsJson[saleKey].plugs);
      for (let j = 0; j < plugsArrayKeys.length; j++) {
        const plugArrayPropertyValue = plugsArrayKeys[j];
        const plugsArray = itemsPlugDataAsJson[saleKey].plugs[plugArrayPropertyValue];
        plugsArray.forEach((plug) => {
          const plugInfo = allItems.find((item) => {
            return item.itemHash === plug.plugItemHash;
          });
          if (!plugInfo) {
            console.log(plugsArray);
          }
          /*   console.log(plugInfo); */
          /* console.log(plugInfo); */

          switch (plugInfo?.itemTypeAndTierDisplayName) {
            case "Legendary Weapon Mod":
            case "Common Restore Defaults":
              return;
          }
          if (plugInfo?.itemName.includes("Tracker") || plugInfo?.plug_category_identifier.includes("trackers")) {
            return;
          }

          if (plugInfo?.itemName.includes("Tier") && plugInfo?.plug_category_identifier.includes("masterworks")) {
            matchedItem.masterWork.masterWorkName = plugInfo.itemName;
            matchedItem.masterWork.masterWorkDescription = plugInfo.itemDescription;
            matchedItem.masterWork.masterWorkIcon = plugInfo.itemIcon;
            matchedItem.masterWork.masterWorkItemHash = plugInfo.itemHash;
            return;
          }
          if (!matchedItem.perks[`perkColumn${plugArrayPropertyValue}`]) {
            matchedItem.perks[`perkColumn${plugArrayPropertyValue}`] = [];
          }

          const perkObject = {
            id: plugInfo.id,
            perkName: plugInfo.itemName,
            perkDescription: plugInfo.itemDescription,
            perkIcon: plugInfo.itemIcon,
            perkHash: plugInfo.itemHash,
            perkTypeDisplayName: plugInfo.itemTypeDisplayName,
            perkTypeAndTierDisplayName: plugInfo.itemTypeAndTierDisplayName,
          };
          matchedItem.perks[`perkColumn${plugArrayPropertyValue}`].push(perkObject);
        });
      }

      gunInfo.push(matchedItem);
      resolve(gunInfo);
    }
  });
};
const insertGuns = (mysqlConnection, vendorID, gunInfo) => {
  return new Promise((resolve, reject) => {
    const describeManifest = `DESCRIBE gun_sales;`;

    mysqlConnection.query(describeManifest, (error, result) => {
      if (error && error.errno === 1146) {
        console.log(error);

        const gunSalesTable = `CREATE TABLE gun_sales (
                             id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                             vendorId INT,
                             itemManifestID INT,
                             itemName VARCHAR(255),
                             itemIcon  TEXT,
                             itemHash BIGINT(255),
                             itemTypeDisplayName VARCHAR(255) ,
                             itemFlavorText TEXT,
                             itemTypeAndTierDisplayName VARCHAR(255),
                             itemSaleKey INT,
                             perks TEXT,
                             masterWork TEXT
                             );`;

        mysqlConnection.query(gunSalesTable, (error, result) => {
          if (error) {
            reject(error);
          }
        });
      } else {
        console.log("Table found, truncating table gun_sales");
        mysqlConnection.query("Truncate table gun_sales", (error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          }
        });
      }

      for (let i = 0; i < gunInfo.length; i++) {
        const {
          id: itemId,
          itemName: itemName,
          itemIcon: itemIcon,
          itemHash: itemHash,
          itemTypeDisplayName: itemTypeDisplayName,
          itemFlavorText: itemFlavorText,
          itemTypeAndTierDisplayName: itemTypeAndTierDisplayName,
          itemSaleKey: itemSaleKey,
          perks,
          masterWork,
        } = gunInfo[i];
        console.log(perks);
        const insertGunInfo = `INSERT INTO gun_sales (vendorId, itemManifestID, itemName, itemIcon, itemHash, itemTypeDisplayName, itemFlavorText, itemTypeAndTierDisplayName,itemSaleKey,perks,masterWork) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        mysqlConnection.query(
          insertGunInfo,
          [
            vendorID["Vendors"]["id"],
            itemId,
            itemName,
            itemIcon,
            itemHash,
            itemTypeDisplayName,
            itemFlavorText,
            itemTypeAndTierDisplayName,
            itemSaleKey,
            JSON.stringify(perks),
            JSON.stringify(masterWork),
          ],
          (error, result) => {
            if (error) {
              reject(error);
            }
            console.log(perks);
            if (i + 1 > gunInfo.length) {
              resolve();
            }
          }
        );
      }
    });
  });
};
const getGunSales = async (name) => {
  try {
    const vendorData = await getVendorData();
    const itemHashList = await getItemHashList(vendorData);
    console.log(itemHashList);
    const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
    const allItems = await getAllItems(mysqlConnection);
    const vendorID = await getVendorID(mysqlConnection, name);
    const gunInfo = await getGunInfo(itemHashList, vendorData, allItems);
    await insertGuns(mysqlConnection, vendorID, gunInfo);
    await mysqlConnection.end((error, result) => {
      if (error) {
        throw error;
      }
    });
  } catch (error) {
    throw error;
  }
};
/* getGunSales("Banshee-44"); */
module.exports = getGunSales;
