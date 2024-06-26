const credentials = require("../Config/config.json");
const { ApiKey, client_id, client_secret, code } = credentials;
const request = require("request");
const fs = require("fs");
const X = btoa(client_id + ":" + client_secret);
// Request for a Manifest url
/* request.get(
  {
    url: "https://www.bungie.net/Platform/Destiny2/Manifest/ ",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-API-Key": ApiKey,
      Authorization: "Basic " + X,
    },
    form: {
       'grant_type': 'authorization_code',
      client_id: client_id,
      code: code,
    },
  },
  function (err, res, body) {
    if (err) {
      console.log(err);
      return;
    }
    const jsonResponse = JSON.parse(body);
    console.log(jsonResponse);
    console.log(credentials.Api.manifestUrl);
    credentials.Api.manifestUrl =
      jsonResponse.Response.mobileWorldContentPaths.en;
    fs.writeFile("");
  }
); */
const manifestUrlRequest = () => {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: "https://www.bungie.net/Platform/Destiny2/Manifest/ ",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-API-Key": ApiKey,
          Authorization: "Basic " + X,
        },
        form: {
          /*  'grant_type': 'authorization_code', */
          client_id: client_id,
          code: code,
        },
      },
      function (err, res, body) {
        if (err) {
          reject(err);
        }
        const jsonResponse = JSON.parse(body);
        console.log(jsonResponse);
        console.log(credentials.Api.manifestUrl);
        credentials.Api.manifestUrl = `https://www.bungie.net${jsonResponse.Response.mobileWorldContentPaths.en}`;
        resolve(jsonResponse.Response.mobileWorldContentPaths.en);
      }
    );
  });
};
const saveManifestUrl = (manifestUrl) => {
  return new Promise((resolve, reject) => {
    /* credentials.Api.manifestUrl = manifestUrl; */
    fs.writeFile(
      "Config/config.json",
      JSON.stringify(credentials),
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });
};
async function getManifestURl() {
  const manifestUrl = await manifestUrlRequest();
  await saveManifestUrl(manifestUrl);
}
getManifestURl();
