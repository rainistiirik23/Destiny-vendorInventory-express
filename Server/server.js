const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
const schedule = require("node-schedule");
const options = {
  cert: fs.readFileSync("Server/Ssl/cert.pem"),
  key: fs.readFileSync("Server/Ssl/key.pem"),
};

const server = https.createServer(options, app);
require("./bootstrap")(router, path);
const refreshData = require("./Utils/refreshData");

app.use(router);

function listen(server) {
  server.listen((port = 8000), () => {
    console.log(`Server now listening at https://localhost:${port}`);
  });
}
/*
----
Every hour perform a job, for that the cron expression is "0 * * * *",
meaning every time at minute 0.
Explanation from https://crontab.guru

----
*/
function dataRefresh(server) {
  console.log("refresh");
  schedule.scheduleJob("1 * * * * ", () => {
    refreshData(server);
  });
}

function startServer(server) {
  listen(server);
  dataRefresh(server);
}
startServer(server);
