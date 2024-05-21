const express = require("express");
const router = express.Router();
const path = require("path");
const allVendorSales = require("../Controllers/getAllVendorSales");

router.get("/", allVendorSales);
module.exports = router;
