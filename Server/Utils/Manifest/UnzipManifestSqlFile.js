const decompress = require("decompress");

function extractManifestArchive(params) {
  decompress("sqliteFile", "dist").then((files) => {
    console.log("done!");
  });
}
module.exports = extractManifestArchive;
