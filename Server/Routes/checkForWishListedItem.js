const express = require("express");
const router = express.Router();
const checkForWishListedItemFunction = require("../Controllers/checkForWishListedItem");
router.post("/", checkForWishListedItemFunction);
module.exports = router;
