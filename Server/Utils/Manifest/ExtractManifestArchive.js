const decompress = require("decompress");

function extractManifestArchive() {
  decompress(
    "Server/Storage/Manifest/SqlLite/manifestSqlLiteFile",
    "Server/Storage/Manifest/SqlLite/WorldContent"
  ).then((files) => {
    console.log("done!");
  });
}
module.exports = extractManifestArchive;
