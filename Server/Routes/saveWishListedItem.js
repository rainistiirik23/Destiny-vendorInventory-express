const express = require("express");
const router = express.Router();
const saveWishLIstedItemController = require("../Controllers/saveWishListedItem");
router.post("/", saveWishLIstedItemController);
module.exports = router;
