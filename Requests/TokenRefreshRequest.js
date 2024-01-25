const fs = require("fs");
const request = require("request");
const {
  Api: { ApiKey, client_id, client_secret, refresh_token },
} = require("../Config/config.json");
const X = btoa(client_id + ":" + client_secret);

/* While it's possible to log in again and again to bungie.net with the account to get the access token and make a VendorRequest,
rather let's use the refresh token to get the access token,without having to log in for each VendorRequest.
NB!! refresh token has an expiration date of 90 days,after that you will  have to log in again.
*/

const tokenRequest = () => {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: "https://www.bungie.net/Platform/App/OAuth/Token/",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-API-Key": ApiKey,
          Authorization: "Basic " + X,
        },

        form: {
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        },
      },
      (err, res, body) => {
        const moreErrorInfo = body + " \nstatus code: " + res.statusCode;
        const bodyAsJSon = JSON.parse(body);
        if (bodyAsJSon.error) {
          reject(moreErrorInfo);
        } else {
          resolve(bodyAsJSon);
        }
      }
    );
  });
};

const readTokenConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Config/config.json", "utf8", (err, res) => {
      const resultAsJson = JSON.parse(res);
      if (err) {
        reject(err);
      } else {
        resolve(resultAsJson);
      }
    });
  });
};

const writeTokens = (configTokens, requestTokens) =>
  new Promise((resolve, reject) => {
    configTokens.Api.access_token = requestTokens["access_token"];
    configTokens.Api.refresh_token = requestTokens[" refresh_token"];
    fs.writeFile(
      "Config/config.json",
      JSON.stringify(configTokens),
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(console.log("Tokens are written"));
        }
      }
    );
  });

const refreshToken = async () => {
  try {
    const requestTokens = await tokenRequest();
    const configTokens = await readTokenConfig();
    await writeTokens(configTokens, requestTokens);
  } catch (err) {
    console.log(err);
  }
};
refreshToken();
