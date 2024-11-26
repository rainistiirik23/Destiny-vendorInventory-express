const axios = require("axios");
const fs = require("fs");

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

const saveManifestUrl = (config) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("Server/Config/config.json", JSON.stringify(config), (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

async function checkManifestURl() {
  try {
    const config = await readConfig();
    const {
      Api: { ApiKey, client_id, client_secret, code, manifestUrl: configManifestUrl },
    } = config;
    const encodedClientIdSecretString = Buffer.from(client_id + ":" + client_secret).toString("base64");
    const axiosRequestInstance = axios.create({
      baseURL: "https://www.bungie.net/Platform/Destiny2/Manifest/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-API-Key": ApiKey,
        Authorization: "Basic " + encodedClientIdSecretString,
        client_id: client_id,
        code: code,
      },
    });
    const manifestUrlRequest = await axiosRequestInstance.get();
    const manifestUrl = `https://www.bungie.net${manifestUrlRequest.data.Response.mobileWorldContentPaths.en}`;
    let isManifestOutdated = false;
    if (configManifestUrl === manifestUrl) {
      return isManifestOutdated;
    }
    let configCopy = { ...config };
    configCopy.Api.manifestUrl = manifestUrl;
    await saveManifestUrl(configCopy);
    isManifestOutdated = true;
    return isManifestOutdated;
  } catch (error) {
    console.error(error);
  }
}

module.exports = checkManifestURl;
