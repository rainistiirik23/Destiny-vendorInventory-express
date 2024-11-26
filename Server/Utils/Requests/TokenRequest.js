const fs = require("fs");
const axios = require("axios");
/*

Request for a Token which Oauth requires to make a VendorRequest.

Access token is valid for an hour and refresh token is valid for 90 days.

*/

const writeTokens = (requestTokens, config) =>
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
async function tokenRequest() {
  try {
    const config = await readConfig();
    const {
      Api: { client_id, client_secret, code },
    } = config;
    const axiosRequestInstance = axios.create({
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const encodedClientIdSecretString = Buffer.from(client_id + ":" + client_secret).toString("base64");
    const TokenRequestResponse = await axiosRequestInstance.post("https://www.bungie.net/Platform/App/OAuth/Token/", {
      Authorization: `Basic ${encodedClientIdSecretString}`,
      client_id: client_id,
      code: code,
      grant_type: "authorization_code",
      client_secret: client_secret,
    });

    await writeTokens(TokenRequestResponse.data, config);
  } catch (err) {
    console.log(err);
  }
}
module.exports = tokenRequest;
