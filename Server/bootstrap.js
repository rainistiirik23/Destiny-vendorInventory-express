const { glob } = require("glob");

const routes = glob.sync("Server/Routes/**.js", { ignore: "node_modules/**" });
module.exports = function (router, path) {
  routes.forEach((file) => {
    require(path.resolve(file))(router);
  });
};
