const decompress = require("decompress");
const fs = require("fs");
const removeOldManifestFile = () => {
  return new Promise((resolve, reject) => {
    fs.readdir("Server/Storage/Manifest/WorldContent", (error, files) => {
      if (error) {
        console.error(error);
        reject(error);
        return;
      } else if (files.length !== 0) {
        const manifestFileName = files.find((file) => file.includes("world_sql_content"));
        fs.rm(`Server/Storage/Manifest/WorldContent/${manifestFileName}`, (error) => {
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
const decompressManifestArchive = () => {
  return new Promise((resolve, reject) => {
    decompress("Server/Storage/Manifest/SqlLite/manifestSqlLiteFile", "Server/Storage/Manifest/WorldContent").then(
      (files) => {
        console.log("done!");
        resolve();
      }
    );
  });
};
async function extractManifestArchive() {
  await removeOldManifestFile();
  await decompressManifestArchive();
}
module.exports = extractManifestArchive;
