const checkManifestUrl = require("./Manifest/CheckManifestUrl");
const getManifestSqlFile = require("./Manifest/GetManifestSqlFile");
const extractManifestArchive = require("./Manifest/ExtractManifestArchive");
const itemManifestToDatabase = require("./Database/ItemManifestToDatabase");
const perkManifestToDatabase = require("./Database/perkManifestToDatabase");
const tokenRefreshRequest = require("./Requests/TokenRefreshRequest");
const tokenRequest = require("./Requests/TokenRequest");
const vendorRequest = require("./Requests/VendorRequest");
const getGunSales = require("./Database/getGunSales");
const readConfig = require("./Config/readConfig");
const authRequest = require("./Requests/Authrequest");

async function refreshVendorData() {
  try {
    const isManifestOutdated = await checkManifestUrl();
    if (isManifestOutdated) {
      console.log("Manifest is outdated");
      await getManifestSqlFile();
      await extractManifestArchive();
      await itemManifestToDatabase();
      await perkManifestToDatabase();
      await allVendorSales();
    } else {
      console.log("Manifest isn't outdated at the moment");
    }
    /*   await tokenRefreshRequest(); */
    const currentDate = new Date();
    const config = await readConfig();
    const {
      Api: { vendorRefreshDate },
    } = config;
    if (currentDate >= new Date(vendorRefreshDate)) {
      console.log("Vendor's inventory refresh date is expired");
      await tokenRefreshRequest();
      await vendorRequest();
      await getGunSales("Banshee-44");
    } else {
      console.log("Vendor's inventory hasn't expired yet");
    }
    // Should I download and save the icons and have the server serve them itself?
    // Keep these functions here but commented out just in case these wil be needed.
    /*
    await getGunIcons();
    await getPerkICons();
    */
  } catch (error) {
    console.error(error);
    if (error?.code === "ECONNREFUSED") {
      console.error("Mysql is offline\nPlease start mysql service and then start express again");
      return;
    }
    if (error.response.status === 401) {
      console.warn("Refresh token has been expired, Retrieving new authorization code and token");
      await authRequest();
      await tokenRequest();
      await refreshVendorData();
    }
  }
}
module.exports = refreshVendorData;
