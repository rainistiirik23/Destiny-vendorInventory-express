const mysql = require("mysql");
const {
  Database: {
    host: host,
    user: databaseUser,
    password: password,
    dataBaseName: dataBaseName,
  },
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

const WishlistedItemsTableCheck = (mysqlConnection) => {
  return new Promise((resolve, reject) => {
    const doesTableExist = `DESCRIBE Wishlisted_items;`;
    mysqlConnection.query(doesTableExist, (error, result) => {
      if (error) {
        if (
          error.errno === 1146 &&
          error["code"].includes("ER_NO_SUCH_TABLE")
        ) {
          console.log(
            "Missing wishlisted items table, adding it to the database schema",
          );
          const createWishListedItemsTable = `CREATE TABLE Wishlisted_items (
                            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                            user_id INT NOT NULL
                            item_hash INT NOT NULL,
                            item_name VARCHAR(255) NOT NULL,
                            item_icon VARCHAR(255) NOT NULL,
                            perks TEXT NOT NULL,
                            masterworks TEXT(255) NOT NULL,
                            );`;

          mysqlConnection.query(createWishListedItemsTable, (error, result) => {
            if (error) {
              reject(error);
            }
            console.log("Successfully created wishlisted items table");
            resolve();
          });
        }
      } else {
        console.log("table found");
        resolve();
      }
    });
  });
};

async function preCheck() {
  try {
    const mysqlConnection = await createMysqlConnection(
      host,
      databaseUser,
      password,
      dataBaseName,
    );
    await WishlistedItemsTableCheck(mysqlConnection);
    await mysqlConnection.end();
  } catch (error) {
    console.log(error);
  }
}
module.exports = saveWishLIstedItem;
