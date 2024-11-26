const fs = require("fs");
const fetch = require("node-fetch");

const profileRequest = (memberShipType, memberShipId, encodedClientIdSecretString, apiKey) => {
  const profileResponse = fetch(
    `https://www.bungie.net/Platform/Destiny2/${memberShipType}/Profile/${memberShipId}/?components=200`,
    {
      method: "get",
      headers: {
        Authorization: "Basic " + encodedClientIdSecretString,
        "X-API-KEY": apiKey,
        Authorization: "Basic " + encodedClientIdSecretString,
      },
    }
  );
  return profileResponse;
};
const readConfigFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Server/Config/config.json", (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(JSON.parse(result));
    });
  });
};
const saveCharacterIdToConifg = (Config) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("Server/Config/config.json", JSON.stringify(Config), (error, result) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};
async function getCharacterId() {
  const config = await readConfigFile();
  const {
    Api: { ApiKey, client_id, client_secret, code },
    SteamAccount: { memberShipType, memberShipId },
  } = config;
  const encodedClientIdSecretString = Buffer.from(client_id + ":" + client_secret).toString("base64");
  const response = await profileRequest(memberShipType, memberShipId, encodedClientIdSecretString, ApiKey);
  const profileInfo = await response.json();
  const config = await readConfig();
  /* const characterID = Object.keys(profileInfo.Response.characters.data)[0]; */
  config.SteamAccount.characterId = Object.keys(profileInfo.Response.characters.data)[0];
  await saveCharacterIdToConifg(config);
  /* console.log(characterID); */
}
getCharacterId();
