const mysql = require("mysql");
const {
  Database: { host: host, user: databaseUser, password: password, dataBaseName: dataBaseName },
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
const getUsersWhisListedItems = (mysqlConnection, userObjectsList) => {
  return new Promise(async (resolve, reject) => {
    const wishListedItems = [];
    /*  const wishListedItemSearchQuery = `Select from Wishlisted_items Where user_id =${userObjectsList}`; */
    userObjectsList.forEach(async (user, index) => {
      const result = await new Promise((resolve, reject) => {
        mysqlConnection.query(`Select * from Wishlisted_items Where user_id = ${user.userId}`, (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        });
      });
      wishListedItems.push(result);
      if (!userObjectsList[index + 1]) {
        resolve(wishListedItems);
      }
    });
    /*    resolve(wishListedItems); */
  });
};
const getCurrentVendorSales = (mysqlConnection) => {
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
const getUsersWhisListedItemsFromSales = (userObjectsList, vendorSales, usersWhisListedItems) => {
  return new Promise((resolve, reject) => {
    const matchingSalesObject = {};
    userObjectsList.forEach((user) => {
      matchingSalesObject[user.userId] = [];
      const findWhislistedItemsByUserId = usersWhisListedItems[0].filter((item) => item.user_id === user.userId);
      for (let i = 0; i < findWhislistedItemsByUserId.length; i++) {
        let doesItemMatch = true;
        const wishListedItem = findWhislistedItemsByUserId[i];
        const itemWithWhishListedItemHash = vendorSales.find((vendorSale) => {
          return vendorSale.itemHash === wishListedItem.item_hash;
        });
        if (!itemWithWhishListedItemHash) {
          continue;
        }
        const perkObjectColumnKeys = Object.keys(JSON.parse(wishListedItem.perks));

        const vendorSaleItemPerks = JSON.parse(itemWithWhishListedItemHash.perks);
        perkObjectColumnKeys.forEach((columnKey) => {
          const wishListedItemPerks = JSON.parse(wishListedItem.perks)[columnKey];
          /*  console.log(wishListedItem); */
          if (wishListedItemPerks.length === 0) {
            return;
          }
          wishListedItemPerks.forEach((wishListPerk) => {
            const findWishListedPerk = vendorSaleItemPerks[columnKey].find((saleItemPerk) => {
              return wishListPerk.item_name === saleItemPerk.itemName;
            });
            if (!findWishListedPerk) {
              doesItemMatch = false;
            }
          });
        });
        /* console.log(wishListedItem); */
        matchingSalesObject[user.userId].push(itemWithWhishListedItemHash);
      }
    });
    resolve(matchingSalesObject);
  });
};
async function checkForWishListedItem(request, response, next) {
  console.log(request.body.data.usersList);
  const usersList = request.body.data.usersList;
  const mysqlConnection = await createMysqlConnection(host, databaseUser, password, dataBaseName);
  const usersWhisListedItems = await getUsersWhisListedItems(mysqlConnection, usersList);
  const vendorInventory = await getCurrentVendorSales(mysqlConnection);
  const usersWishListedSales = await getUsersWhisListedItemsFromSales(usersList, vendorInventory, usersWhisListedItems);
  console.log(usersWishListedSales);
  mysqlConnection.end();
  response.json(usersWishListedSales);
}
module.exports = checkForWishListedItem;
