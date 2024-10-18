const mysql = require("mysql");
const sqlite3 = require("sqlite3");
const fs = require("fs");
const {
  Database: { host: host, user: databaseUser, password: password, dataBaseName: dataBaseName },
} = require("../../../Config/config.json");
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
const getAllVendorSales = (mysqlConnection) => {
  return new Promise((resolve, reject) => {
    const query = `Select id,item_hash from allVendorSales`;
    mysqlConnection.query(query, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};
const getInventoryItemDefinitions = () => {
  return new Promise((resolve, reject) => {
    const manifest = new sqlite3.Database(
      "dist/world_sql_content_14e4321b227a904753480705bc9a3651.content",
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
const getSalesStats = (allVendorSales, inventoryItemDefinitions) => {
  return new Promise((resolve, reject) => {
    const salesWithStats = [];
    allVendorSales.forEach((vendorSale) => {
      const vendorSaleWithStatsObject = {};
      vendorSaleWithStatsObject.itemId = allVendorSales.id;
      vendorSaleWithStatsObject.itemHash = allVendorSales.item_hash;
      vendorSaleWithStatsObject.stats = allVendorSales.item_hash;
      const inventoryItemDefinition = inventoryItemDefinitions.find((inventoryItem, itemIndex) => {
        return JSON.parse(inventoryItem[itemIndex].json).hash === vendorSale.item_hash;
      });
      for (let i = 0; i < inventoryItemDefinition.stats.stats.length; i++) {
        const vendorSaleWithStatsObject = {};
        vendorSaleWithStatsObject.itemId = allVendorSales.id;
        vendorSaleWithStatsObject.itemHash = allVendorSales.item_hash;
        vendorSaleWithStatsObject.stats = allVendorSales.item_hash;
      }
    });
  });
};
async function allVendorSaleStats() {
  const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
  const allVendorSales = await getAllVendorSales(mysqlConnection);
  const inventoryItemDefinitions = getInventoryItemDefinitions();
  const allSalesStats = await getSalesStats(allVendorSales, inventoryItemDefinitions);
  console.log(allVendorSales);
}
allVendorSaleStats();
