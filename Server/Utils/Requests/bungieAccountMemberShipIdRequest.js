const fetch = require("node-fetch");
const fs = require("fs");

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
const memberShipIdrequest = (steamId, encodedClientIdSecretString, apiKey) => {
  const response = fetch(
    `https://www.bungie.net/Platform/User/GetMembershipFromHardLinkedCredential/SteamID/${steamId}/`,
    {
      method: "get",
      headers: {
        Authorization: "Basic " + encodedClientIdSecretString,
        "X-API-KEY": apiKey,
        Authorization: "Basic " + encodedClientIdSecretString,
      },
    }
  );
  return response;
};
const writeMemberShipIdToConfig = (Config) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("Server/Config/config.json", JSON.stringify(Config), (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve();
    });
  });
};
async function getBungieAccountMembershipId() {
  try {
    const response = await memberShipIdrequest();
    const responseData = await response.json();
    const config = await readConfig();
    config.SteamAccount.memberShipId = responseData.Response.membershipId;
    await writeMemberShipIdToConfig(config);
  } catch (error) {
    console.error(error);
  }
}
getBungieAccountMembershipId();
