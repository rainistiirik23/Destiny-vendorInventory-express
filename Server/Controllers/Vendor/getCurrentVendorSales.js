const {
  Database: { host: host, user: databaseUser, password: password, dataBaseName: dataBaseName },
} = require("../../../Config/config.json");
const mysql = require("mysql");
const sqlite3 = require("sqlite3");
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

const getCurrentVendorSalesFromDatabase = (mysqlConnection) => {
  return new Promise((resolve, reject) => {
    const query = `Select * from gun_sales`;
    mysqlConnection.query(query, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

async function getCurrentVendorSales(req, res, next) {
  try {
    const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
    const currentVendorSales = await getCurrentVendorSalesFromDatabase(mysqlConnection);
    await mysqlConnection.end();
    res.status(200).json({ currentVendorSales: currentVendorSales });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}
module.exports = getCurrentVendorSales;
