const express = require("express");
const router = express.Router();
const path = require("path");
const allCurrentVendorSales = require("../Controllers/getAllVendorSales");

router.get("/", allCurrentVendorSales);
module.exports = router;
