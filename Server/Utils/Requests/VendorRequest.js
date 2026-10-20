const fs = require("fs");
const axios = require("axios");

const readConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Server/Config/config.json", (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.parse(result));
    });
  });
};
const cacheVendorRequest = (vendorRequestResponse) =>
  new Promise((resolve, reject) => {
    fs.writeFile(
      "Server/Storage/Request/vendorRequest.json",
      JSON.stringify(vendorRequestResponse),
      { flag: "w" },
      function (err, result) {
        if (err) {
          reject(console.log("error", err));
        } else {
          resolve(console.log("Vendor request is cached"));
        }
      },
    );
  });

const saveVendorRefreshDate = (config, vendorRequestResponse) => {
  return new Promise((resolve, reject) => {
    const configWithVendorRefreshDate = { ...config };
    configWithVendorRefreshDate.Api.nextVendorRefreshDate =
      vendorRequestResponse.data.Response.vendor.data.nextRefreshDate;
    fs.writeFile("Server/Config/config.json", JSON.stringify(configWithVendorRefreshDate), (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(console.log("Vendor Refresh date has been saved to config"));
      }
    });
  });
};
async function vendorRequest() {
  const credentials = await readConfig();
  const {
    Api: { ApiKey, access_token },
    SteamAccount: { memberShipType, memberShipId, characterId },
  } = credentials;
  try {
    const vendorRequestResponse = await axios.get(
      `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${memberShipId}/Character/${characterId}/Vendors/672118013/?components=402,310,305,400`,
      {
        headers: {
          "X-API-KEY": ApiKey,
          Authorization: "Bearer " + access_token,
        },
      },
    );
    await cacheVendorRequest(vendorRequestResponse.data);
    await saveVendorRefreshDate(credentials, vendorRequestResponse);
  } catch (error) {
    console.log({
      statusCode: error.response?.status ?? 500,
      statusText: error.response?.statusText ?? error.message,
      errorData: error.response?.data ?? null,
    });
    return;
  }
}
module.exports = vendorRequest;
