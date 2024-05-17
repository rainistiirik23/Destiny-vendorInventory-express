const express = require("express");
const router = express.Router();
const path = require("path");
const deleteWishlistedItem = require("../Controllers/deleteWishlistedItem");

router.delete("/", deleteWishlistedItem);
module.exports = router;
