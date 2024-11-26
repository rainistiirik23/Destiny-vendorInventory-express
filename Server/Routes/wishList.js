const cors = require("cors");
const { corsOptions } = require("../Config/config.json");
const editWishlistedItem = require("../Controllers/WishList/editWishlistedItem");
const deleteWishlistedItem = require("../Controllers/WishList/deleteWishlistedItem");
const checkForWishListedItemFunction = require("../Controllers/WishList/checkForWishListedItem");
const usersWishListedSales = require("../Controllers/WishList/getUsersWishListedSales");
const saveWishLIstedItemController = require("../Controllers/WishList/saveWishListedItem");

module.exports = function (router) {
  router.put("/api/editWishListedItem", cors(corsOptions), editWishlistedItem);
  router.delete("/api/deleteWishlistedItem", cors(corsOptions), deleteWishlistedItem);
  router.post("/api/checkForWishListedItem", cors(corsOptions), checkForWishListedItemFunction);
  router.post("/api/getUsersWishListedSales", cors(corsOptions), usersWishListedSales);
  router.post("/api/saveWishListedItem", cors(corsOptions), saveWishLIstedItemController);
};
