const {
  Api: { ApiKey, client_id, client_secret, code },
} = require("../../../Config/config.json");
const request = require("request");
const fs = require("fs");
const X = Buffer.from(client_id + ":" + client_secret).toString("base64");
const axios = require("axios");
const axiosRequestInstance = axios.create({
  /*  params: new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    client_id: client_id,
  }), */
  /*  baseURL: `https://www.bungie.net/Platform/App/OAuth/Token/`,
  data: qs.stringify({
    code: code,
    grant_type: "authorization_code",
    client_id: client_id,
  }),
 */
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    /*  "X-API-Key": ApiKey,
    hasContentType: true,
    Authorization: `Basic ${X}`, */
  },
});
// Request for a Token which Oauth requires to make a VendorRequest

const tokenRequest = () => {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: "https://www.bungie.net/Platform/App/OAuth/Token/",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-API-Key": ApiKey,
        },
        form: {
          grant_type: "authorization_code",
          client_id: client_id,
          code: code,
        },
      },
      (err, res, body) => {
        const bodyAsJson = JSON.parse(body);
        if (bodyAsJson.error) {
          const moreErrorInfo = body + " \nstatus code: " + res.statusCode;
          reject(moreErrorInfo);
        } else {
          resolve(bodyAsJson);
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
    configTokens.Api.refresh_token = requestTokens["refresh_token"];

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

    const configTokens = await readTokenConfig();
    await writeTokens(configTokens, requestTokens);
  } catch (err) {
    console.log(err);
  }
};
tokenRequestCache();
