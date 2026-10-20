const checkManifestUrl = require("./Manifest/CheckManifestUrl");
const getManifestSqlFile = require("./Manifest/GetManifestSqlFile");
const extractManifestArchive = require("./Manifest/ExtractManifestArchive");
const itemManifestToDatabase = require("./Database/ItemManifestToDatabase");
const allVendorSales = require("./Database/allVendorSales");
const tokenRefreshRequest = require("./Requests/TokenRefreshRequest");
const tokenRequest = require("./Requests/TokenRequest");
const vendorRequest = require("./Requests/VendorRequest");
const getGunSales = require("./Database/getGunSales");
const readConfig = require("./File/ReadConfig");
const authRequest = require("./Requests/Authrequest");
const getVendorInfo = require("./Database/getVendorInfo");
async function refreshVendorData() {
  try {
    const isManifestOutdated = await checkManifestUrl();
    if (isManifestOutdated) {
      await getManifestSqlFile();
      await extractManifestArchive();
      await itemManifestToDatabase();
      await getVendorInfo();
      await allVendorSales();
    }

    const currentDate = new Date();
    const config = await readConfig();
    const vendorRefreshDate = config.Api.nextVendorRefreshDate;
    if (currentDate > new Date(vendorRefreshDate)) {
      console.log("Vendor's inventory refresh date is expired");
      await tokenRefreshRequest();
      await vendorRequest();
      await getGunSales("Banshee-44");
    } else {
      console.log("Vendor's inventory hasn't expired yet");
    }
  } catch (error) {
    console.error(error);
    if (error?.code === "ECONNREFUSED") {
      console.error("Mysql is offline\nPlease start mysql service and then start express again");
      return;
    }

    //---------------------------------------------------------------------------------------------------------------------

    /* "ApplicationTokenKeyIdDoesNotExist" indicates that the refresh token is expired, altough before just using the 401
    status code as part of the condition would work.    
    */
    //---------------------------------------------------------------------------------------------------------------------

    if (
      error?.response.status === 400 &&
      error?.response.data.error_description === "ApplicationTokenKeyIdDoesNotExist"
    ) {
      console.warn("It's possible that refresh_token has expired, getting a new refresh token");
      try {
        await authRequest();
        await tokenRequest();
        await getGunSales("Banshee-44");
        console.log("Refresh token aqquired, credentials refresh successful");

        return;
      } catch (error) {
        if (Object.hasOwn(error, "response")) {
          console.log(
            "Failed to retrieve refresh token, either the refresh token is not actually expired or something else is wrong",
          );
          throw {
            statusCode: error.response.status,
            statusText: error.response.statusText,
            errorData: error.response.data,
          };
        }
        console.log("Something else went wrong during refresh token retrieval");
        throw error;
      }
    }
    if (Object.hasOwn(error, "response")) {
      throw {
        statusCode: error.response.status,
        statusText: error.response.statusText,
        errorData: error.response.data,
      };
    }
    throw error;
  }
  return;
}

module.exports = refreshVendorData;
