const https = require("https");
const fs = require("fs");
/*
This function needs the correct manifest url, which will sometimes need to be updated,
because of that config require is in the promise code block due to it not reading the correct manifest version
after node fs writefile function is called
*/
function getManifestSqlFile() {
  return new Promise((resolve, reject) => {
    const {
      Api: { manifestUrl },
    } = require("../../Config/config.json");
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
