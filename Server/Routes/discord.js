const cors = require("cors");
const { corsOptions } = require("../Config/config.json");
const getUserId = require("../Controllers/Discord/getUserId");
module.exports = function (router) {
  router.post("/api/getUserId", cors(corsOptions), getUserId);
};
