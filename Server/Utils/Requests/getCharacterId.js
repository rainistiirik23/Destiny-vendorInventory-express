const config = require("../../../Config/config.json");

const fs = require("fs");
const fetch = require("node-fetch");
const {
  Api: { ApiKey, client_id, client_secret, code },
  SteamAccount: { memberShipType, memberShipId },
} = config;

const X = btoa(client_id + ":" + client_secret);
const profileRequest = () => {
  const profileResponse = fetch(
    `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${memberShipId}/?components=200`,
    {
      method: "get",
      headers: {
        Authorization: "Basic " + X,
        "X-API-KEY": ApiKey,
        Authorization: "Basic " + X,
      },
    }
  );
  return profileResponse;
};
const readConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Config/config.json", (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.parse(data));
    });
  });
};
const saveCharacterIdToConifg = (Config) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("Config/config.json", JSON.stringify(Config), (error, result) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};
async function getCharacterId() {
  const response = await profileRequest();
  const profileInfo = await response.json();
  const config = await readConfig();
  /* const characterID = Object.keys(profileInfo.Response.characters.data)[0]; */
  config.SteamAccount.characterId = Object.keys(profileInfo.Response.characters.data)[0];
  await saveCharacterIdToConifg(config);
  /* console.log(characterID); */
}
getCharacterId();
