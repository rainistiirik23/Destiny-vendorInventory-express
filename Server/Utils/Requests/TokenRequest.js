const config = require("../../Config/config.json");
const {
  Api: { ApiKey, client_id, client_secret, code, access_token, refresh_token },
} = config;

const fs = require("fs");
const encodedClientIdSecretString = Buffer.from(client_id + ":" + client_secret).toString("base64");
const axios = require("axios");
const axiosRequestInstance = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
/*

Request for a Token which Oauth requires to make a VendorRequest.

Access token is valid for an hour and refresh token is valid for 90 days.

*/

const writeTokens = (requestTokens) =>
  new Promise((resolve, reject) => {
    const configTokens = Object.assign({}, config);
    configTokens.Api.access_token = requestTokens["access_token"];
    configTokens.Api.refresh_token = requestTokens["refresh_token"];

    fs.writeFile("Server/Config/config.json", JSON.stringify(configTokens), (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(console.log("Tokens are written"));
      }
    });
  });
async function tokenRequestCache() {
  try {
    const TokenRequestResponse = await axiosRequestInstance.post("https://www.bungie.net/Platform/App/OAuth/Token/", {
      Authorization: `Basic ${encodedClientIdSecretString}`,
      client_id: client_id,
      code: code,
      grant_type: "authorization_code",
      client_secret: client_secret,
    });

    await writeTokens(TokenRequestResponse.data);
  } catch (err) {
    console.log(err);
  }
}
module.exports = tokenRequestCache;
