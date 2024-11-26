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
    fs.readFile("Cache/VendorRequest.json", "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
const getVendorPerkData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Cache/PerkRequest.json", "utf8", function (err, data) {
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
    const gunSales = JSON.parse(Vendordata)["Response"]["sales"]["data"];
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
const getGunInfo = (mysqlConnection, items, perkData, allItems) => {
  return new Promise(async (resolve, reject) => {
    /*  console.log(allItems); */
    const itemHashQuery = `SELECT * FROM Item_manifest WHERE itemHash=?;`;
    const perkQuery = `SELECT * FROM Perk_manifest WHERE perkHash=?;`;
    let gunInfo = [];
    const perkDataAsJson = JSON.parse(perkData).Response.itemComponents.reusablePlugs.data;
    const socketDataAsJson = JSON.parse(perkData).Response.itemComponents.sockets.data;
    console.log(socketDataAsJson);
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
      /*     console.log(Object.values(perkDataAsJson)); */
      /*  console.log(Object.values(perkDataAsJson[saleKey])); */
      /* console.log(saleKey); */
      /* if (!Object.values(perkDataAsJson[saleKey])) {
        continue;
        } */
      if (!socketDataAsJson[saleKey]?.sockets) {
        console.log(saleKey);
      }
      const socketArray = socketDataAsJson[saleKey].sockets;
      let perkColumnIndex = 1;
      socketArray.forEach((socketItem) => {
        if (!socketItem.plugHash) {
          return;
        }
        const socketItemInfo = allItems.find((item) => {
          return item.itemHash === socketItem.plugHash;
        });
        if (!socketItemInfo?.itemName) {
          console.log(socketItem);
        }
        if (
          socketItemInfo.itemName.includes("Frame") ||
          socketItemInfo.plug_category_identifier.includes("intrinsics")
        ) {
          return;
        }
        if (
          socketItemInfo.itemName.includes("Tier") &&
          socketItemInfo.plug_category_identifier.includes("masterworks")
        ) {
          matchedItem.masterWork.masterWorkName = socketItemInfo.itemName;
          matchedItem.masterWork.masterWorkDescription = socketItemInfo.itemDescription;
          matchedItem.masterWork.masterWorkIcon = socketItemInfo.itemIcon;
          matchedItem.masterWork.masterWorkItemHash = socketItemInfo.itemHash;
          return;
        }
        switch (socketItemInfo.itemName) {
          case "Default Shader":
          case "Empty Mod Socket":
          case "Kill Tracker":
            return;
        }
        if (!matchedItem.perks[`perkColumn${perkColumnIndex}`]) {
          matchedItem.perks[`perkColumn${perkColumnIndex}`] = [];
        }
        const perkObject = {
          id: socketItemInfo.id,
          perkName: socketItemInfo.itemName,
          perkDescription: socketItemInfo.itemDescription,
          perkIcon: socketItemInfo.itemIcon,
          perkHash: socketItemInfo.itemHash,
          perkTypeDisplayName: socketItemInfo.itemTypeDisplayName,
          perkTypeAndTierDisplayName: socketItemInfo.itemTypeAndTierDisplayName,
        };
        matchedItem.perks[`perkColumn${perkColumnIndex}`].push(perkObject);
        perkColumnIndex++;
      });

      gunInfo.push(matchedItem);
    }
    resolve(gunInfo);
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
    const perkData = await getVendorPerkData();
    /*  const vendorData = await fetch(
        `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${memberShipId}/Character/${characterId}/Vendors/672118013/?components=402`,
        {
            "X-API-KEY": ApiKey,
            Authorization: "Bearer " + access_token,
        }
        ); */
    /* console.log(vendorData); */

    const itemHashList = await getItemHashList(JSON.parse(vendorData));
    console.log(itemHashList);
    const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
    const allItems = await getAllItems(mysqlConnection);
    const vendorID = await getVendorID(mysqlConnection, name);
    const gunInfo = await getGunInfo(mysqlConnection, itemHashList, perkData, allItems);
    console.log(gunInfo[4].perks);
    await insertGuns(mysqlConnection, vendorID, gunInfo);
    await mysqlConnection.end((error, result) => {
      if (error) {
        throw error;
      }
    });
    process.exit(0);
  } catch (error) {
    throw error;
  }
};
getGunSales("Banshee-44", Vendordata, perkData);
