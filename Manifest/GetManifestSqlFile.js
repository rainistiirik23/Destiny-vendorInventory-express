const https = require("https");
const credentials = require('../Config/config.json')
const { manifestUrl } = credentials
const fs = require('fs')

https.get(manifestUrl, (res) => {
    const path = "sqliteFile";
    const writeStream = fs.createWriteStream(path);
    res.pipe(writeStream);

    writeStream.on("finish", () => {
        writeStream.close();
        console.log("Download Completed");
    });
});
