const https = require("https");
const {
  Api: { manifestUrl },
} = require("../../Config/config.json");
const fs = require("fs");

function getManifestSqlFile() {
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
}
module.exports = getManifestSqlFile;
