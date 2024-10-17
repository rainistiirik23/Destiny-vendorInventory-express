const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");
const config = require("../../../Config/config.json");
const {
  Discord: { clientId, clientSecret },
} = config;

const { URLSearchParams } = require("url");
const readConfig = (config) => {
  return new Promise((resolve, reject) => {
    fs.readFile("../../Config/config.json", (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.parse(result));
    });
  });
};
const getDiscordAccessToken = (clientId, clientSecret, authCode) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: authCode,
        grant_type: "authorization_code",
        scope: ["identify"],
        redirect_uri: "http://127.0.0.1:5173/vendorWishList",
      }).toString(),
    });
    resolve(response);
  });
};
const getUserDiscordId = (tokenType, accessToken) => {
  return new Promise((resolve, reject) => {
    const response = fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `${tokenType} ${accessToken}` },
    });
    resolve(response);
  });
};
const sendUserData = (response, userIdJson) => {
  return new Promise((resolve, reject) => {
    response.json(userIdJson);
    resolve();
  });
};
async function getUserId(request, response, next) {
  try {
    const authCode = await request.body.data.code;
    console.log(authCode);
    if (authCode) {
      const discordAccessToken = await getDiscordAccessToken(clientId, clientSecret, authCode);
      const discordAccessTokenData = await discordAccessToken.json();
      const discordId = await getUserDiscordId(discordAccessTokenData.token_type, discordAccessTokenData.access_token);
      const discordIdJson = await discordId.json();
      console.log(discordAccessToken);
      await sendUserData(response, discordIdJson);
    }

    /*   response.status(200).json("success"); */
  } catch (error) {
    response.status(500).json("Server error");
    console.log(error);
  }
}
module.exports = getUserId;
