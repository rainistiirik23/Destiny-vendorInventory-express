const {
  Api: { ApiKey, client_id, client_secret, code, manifestUrl: configManifestUrl },
} = require("../../Config/config.json");

const axios = require("axios");
const fs = require("fs");
const X = btoa(client_id + ":" + client_secret);
const axiosRequestInstance = axios.create({
  baseURL: "https://www.bungie.net/Platform/Destiny2/Manifest/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-API-Key": ApiKey,
    Authorization: "Basic " + X,
    client_id: client_id,
    code: code,
  },
});

const saveManifestUrl = (manifestUrl) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("Config/config.json", JSON.stringify(credentials), (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

async function getManifestURl() {
  try {
    console.log("active");
    const manifestUrlRequest = await axiosRequestInstance.get();
    const manifestUrl = `https://www.bungie.net${manifestUrlRequest.data.Response.mobileWorldContentPaths.en}`;
    console.log(manifestUrlRequest);

    if (configManifestUrl === manifestUrl) {
      return;
    }
    /*  await saveManifestUrl(manifestUrl); */
  } catch (error) {
    console.error(error);
  }
}
getManifestURl();
/* module.exports = getManifestURl; */
