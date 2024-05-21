const express = require("express");
const router = express.Router();
const path = require("path");
const currentVendorSales = require("../Controllers/getCurrentVendorSales");

router.get("/", currentVendorSales);
module.exports = router;
