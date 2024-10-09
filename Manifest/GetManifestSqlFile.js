const https = require("https");
const {
  Api: { manifestUrl },
} = require("../Config/config.json");

const fs = require("fs");

https.get(manifestUrl, (res) => {
    const path = "sqliteFile";
    const writeStream = fs.createWriteStream(path);
    res.pipe(writeStream);

    writeStream.on("finish", () => {
        writeStream.close();
        console.log("Download Completed");
    });
});
