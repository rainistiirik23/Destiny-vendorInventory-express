const express = require("express");
const router = express.Router();
const path = require("path");
const RenderWishList = require("../Controllers/wishlist");
const editWishlistedItem = require("../Controllers/WishList/editWishlistedItem");
const deleteWishlistedItem = require("../Controllers/WishList/deleteWishlistedItem");
const checkForWishListedItemFunction = require("../Controllers/WishList/checkForWishListedItem");
const usersWishListedSales = require("../Controllers/WishList/getUsersWishListedSales");
const saveWishLIstedItemController = require("../Controllers/WishList/saveWishListedItem");
const corsOptions = {
  origin: "http://127.0.0.1:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
module.exports = function (router) {
  router.put("/api/editWishListedItem", editWishlistedItem);
  router.delete("/api/deleteWishlistedItem", deleteWishlistedItem);
  router.post("/api/checkForWishListedItem", checkForWishListedItemFunction);
  router.post("/api/getUsersWishListedSales", usersWishListedSales);
  router.post("/api/saveWishListedItem", saveWishLIstedItemController);
};
