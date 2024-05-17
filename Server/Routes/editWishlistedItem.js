const express = require("express");
const router = express.Router();
const path = require("path");
const editWishlistedItem = require("../Controllers/editWishlistedItem");

router.put("/", editWishlistedItem);
module.exports = router;
