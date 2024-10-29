const fs = require("fs");
const axios = require("axios");
const config = require("../../Config/config.json");
const {
  Api: { ApiKey, client_id, client_secret, refresh_token },
} = config;
const encodedClientIdSecretString = Buffer.from(client_id + ":" + client_secret).toString("base64");
const axiosRequestInstance = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
/* While it's possible to log in again and again to bungie.net with the account to get the access token and make a VendorRequest,
rather let's use the refresh token to get the access token,without having to log in for each VendorRequest.
NB!! refresh token has an expiration date of 90 days,after that you will  have to log in again.
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

const refreshToken = async () => {
  try {
    const requestTokens = await axiosRequestInstance.post("https://www.bungie.net/Platform/App/OAuth/Token/", {
      "X-API-Key": ApiKey,
      Authorization: `Basic ${encodedClientIdSecretString}`,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    });
    await writeTokens(requestTokens.data);
  } catch (err) {
    console.log(err);
  }
};
refreshToken();
