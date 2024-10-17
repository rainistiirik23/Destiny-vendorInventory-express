const allVendorSales = require("../Controllers/getAllVendorSales");
const currentVendorSales = require("../Controllers/getCurrentVendorSales");

module.exports = function (router) {
  router.get("/api/allVendorSales", allVendorSales);
  router.get("/api/currentVendorSales", currentVendorSales);
};
