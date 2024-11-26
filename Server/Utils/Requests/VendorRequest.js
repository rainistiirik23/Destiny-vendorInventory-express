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
      "./Cache/VendorRequest.json",
      JSON.stringify(vendorRequestResponse),
      { flag: "w" },
      function (err, result) {
        if (err) {
          reject(console.log("error", err));
        } else {
          resolve(console.log("Vendor request is cached"));
        }
      }
    );
  });
const vendorRequestCache = async () => {
  try {
    const vendorRequestResponse = await axiosRequestInstance.get(
      `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${memberShipId}/Character/${characterId}/Vendors/672118013/?components=402`
    );
    await cacheVendorRequest(vendorRequestResponse.data);
  } catch (err) {
    console.log(err);
  }
};
vendorRequestCache();
