const {
  Database: { host: host, user: databaseUser, password: password, dataBaseName: dataBaseName },
} = require("../../Config/config.json");
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

const getUsersWishListedSalesFromDatabase = (mysqlConnection, userId) => {
  return new Promise((resolve, reject) => {
    const query = `Select * from Wishlisted_items Where user_id = ${userId}`;
    mysqlConnection.query(query, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

async function getUsersWishListedSales(request, response, next) {
  try {
    const userId = await request.body.data.userId;
    console.log(userId);
    const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
    const usersWishListedSales = await getUsersWishListedSalesFromDatabase(mysqlConnection, userId);
    await mysqlConnection.end();
    response.status(200).json(usersWishListedSales);
  } catch (error) {
    console.log(error);
    response.status(500);
  }
}
module.exports = getUsersWishListedSales;
