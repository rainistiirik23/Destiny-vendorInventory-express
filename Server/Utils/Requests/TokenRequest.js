const {
  Api: { ApiKey, client_id, client_secret, code, access_token, refresh_token },
} = require("../../../Config/config.json");

const fs = require("fs");
const X = Buffer.from(client_id + ":" + client_secret).toString("base64");
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
    const configTokens = Object.create({
      access_token: access_token,
      refreshToken: refresh_token,
    });
    configTokens.access_token = requestTokens["access_token"];
    configTokens.refresh_token = requestTokens["refresh_token"];

    fs.writeFile("Config/config.json", JSON.stringify(configTokens), (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(console.log("Tokens are written"));
      }
    });
  });
const tokenRequestCache = async () => {
  try {
    const requestTokens = await axiosRequestInstance.post("https://www.bungie.net/Platform/App/OAuth/Token/", {
      Authorization: `Basic ${X}`,
      client_id: client_id,
      code: code,
      grant_type: "authorization_code",
      client_secret: client_secret,
    }).data;

    await writeTokens(requestTokens);
  } catch (err) {
    console.log(err);
  }
};
tokenRequestCache();
