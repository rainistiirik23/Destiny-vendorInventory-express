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

const deleteWishlistedItemFromDatabase = (mysqlConnection, sale) => {
  return new Promise((resolve, reject) => {
    const { user_id, id } = sale;
    const editWishlistedItemQuery = `DELETE FROM Wishlisted_items WHERE user_id = ? AND id = ?`;
    mysqlConnection.query(editWishlistedItemQuery, [user_id, id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

async function deleteWishlistedItem(request, response, next) {
  try {
    const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
    console.log(request.body);
    await deleteWishlistedItemFromDatabase(mysqlConnection, request.body);
    await mysqlConnection.end();
    response.status(200).json("success");
  } catch (error) {
    console.log(error);
    response.status(500);
  }
}
module.exports = deleteWishlistedItem;
