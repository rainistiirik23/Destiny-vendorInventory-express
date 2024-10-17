const getUserId = require("../Controllers/Discord/getUserId");
module.exports = function (router) {
  router.post("/api/getUserId", getUserId);
};
