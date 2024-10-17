const mysql = require("mysql");
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

const saveUsersWishListedItem = (mysqlConnection, requestData) => {
  return new Promise((resolve, reject) => {
    const {
      itemData: { itemName, itemHash, itemIcon, perks, masterWorks },
      userData: { id: userId },
    } = requestData;
    const findUserByIdQuery = `INSERT INTO Wishlisted_items(user_id,item_hash,item_name,item_icon,perks,masterworks) VALUES(?, ?, ?, ?, ?,?)`;
    mysqlConnection.query(
      findUserByIdQuery,
      [userId, itemHash, itemName, itemIcon, JSON.stringify(perks), JSON.stringify(masterWorks)],
      (error, result) => {
        if (error) {
          reject(error);
        }
        console.log(result);
        resolve();
      }
    );
  });
};
async function saveWishLIstedItem(request, response, next) {
  try {
    const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
    await saveUsersWishListedItem(mysqlConnection, request.body.data);
    console.log(request.body.data);
    response.status(200).json("route is working");
    await mysqlConnection.end();
  } catch (error) {
    console.log(error);
  }
}
module.exports = saveWishLIstedItem;
