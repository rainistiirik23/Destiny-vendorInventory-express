const allVendorSales = require("../Controllers/Vendor/getAllVendorSales");
const currentVendorSales = require("../Controllers/Vendor/getCurrentVendorSales");

module.exports = function (router) {
  router.get("/api/allVendorSales", allVendorSales);
  router.get("/api/currentVendorSales", currentVendorSales);
};
