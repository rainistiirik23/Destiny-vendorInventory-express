const {
  Database: { host: host, user: databaseUser, password: password, dataBaseName: dataBaseName },
} = require("../../Config/config.json");
const mysql = require("mysql");
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

const updateWishlistedItemOnDatabase = (mysqlConnection, sale) => {
  return new Promise((resolve, reject) => {
    const { perks, masterworks, user_id, id } = sale;
    const editWishlistedItemQuery = `UPDATE Wishlisted_items SET perks = ?, masterworks = ? WHERE user_id = ? AND id = ?`;
    mysqlConnection.query(editWishlistedItemQuery, [perks, masterworks, user_id, id], (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

async function editWishlistedItem(request, response, next) {
  try {
    const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
    await updateWishlistedItemOnDatabase(mysqlConnection, request.body.data);
    await mysqlConnection.end();
    response.status(200).json("success");
  } catch (error) {
    console.log(error);
    response.status(500);
  }
}
module.exports = editWishlistedItem;
