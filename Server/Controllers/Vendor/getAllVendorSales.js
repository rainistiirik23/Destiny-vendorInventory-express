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

const getAllVendorSalesFromDatabase = (mysqlConnection) => {
  return new Promise((resolve, reject) => {
    const query = `Select * from allVendorSales`;
    mysqlConnection.query(query, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

async function getAllVendorSales(req, res, next) {
  try {
    const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
    const allVendorSales = await getAllVendorSalesFromDatabase(mysqlConnection);
    await mysqlConnection.end();
    res.status(200).json({ allVendorSales: allVendorSales });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}
module.exports = getAllVendorSales;
