const https = require("https");
const fs = require("fs");
/*
This function needs the correct manifest url, which will sometimes need to be updated,
because of that config require is in the promise code block due to it not reading the correct manifest version
after node fs writefile function is called
*/
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
const removeOldManifestSQlFile = () => {
  return new Promise((resolve, reject) => {
    fs.readdir("Server/Storage/Manifest/SqlLite", (error, files) => {
      if (error) {
        console.error(error);
        reject(error);
        return;
      } else if (files.length !== 0) {
        fs.rm("Server/Storage/Manifest/SqlLite/manifestSqlLiteFile", (error) => {
          if (error) {
            console.error(error);
            reject(error);
            return;
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};
const manifestSqlFileRequest = (manifestUrl) => {
  return new Promise((resolve, reject) => {
    const manifestRequest = https.get(manifestUrl);
    manifestRequest.on("response", (response) => {
      if (response.statusCode !== 200) {
        reject(
          `Retrieving manifest sql file failed with statuscode ${response.statusCode} and status message ${response.statusMessage}`
        );
        return;
      }
      const writeStream = fs.createWriteStream("Server/Storage/Manifest/SqlLite/manifestSqlLiteFile");

      response.pipe(writeStream);
      writeStream.on("finish", () => {
        writeStream.close();
        console.log("Download Completed");
        resolve();
      });
    });
  });
};
async function getManifestSqlFile() {
  const config = await readConfig();
  const {
    Api: { manifestUrl },
  } = config;
  await manifestSqlFileRequest(manifestUrl);
}
module.exports = getManifestSqlFile;
