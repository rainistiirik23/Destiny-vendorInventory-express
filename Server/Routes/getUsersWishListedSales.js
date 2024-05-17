const express = require("express");
const router = express.Router();
const path = require("path");
const usersWishListedSales = require("../Controllers/getUsersWishListedSales");

router.post("/", usersWishListedSales);
module.exports = router;
