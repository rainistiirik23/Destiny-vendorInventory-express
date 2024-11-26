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
    "https://www.bungie.net/Platform/User/GetMembershipFromHardLinkedCredential/SteamID/76561199622021169/",
    {
      method: "get",
      headers: {
        Authorization: "Basic " + X,
        "X-API-KEY": ApiKey,
        Authorization: "Basic " + X,
      },
    }
  );
  return response;
};
const writeMemberShipIdToConfig = (Config) => {
  fs.writeFile("Config/config.json", JSON.stringify(Config), (error, result) => {
    if (error) {
      console.log(error);
    }
  });
};
const readConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Config/config.json", "utf8", (error, data) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(JSON.parse(data));
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
