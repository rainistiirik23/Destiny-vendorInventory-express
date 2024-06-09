const express = require("express");
const app = express();
const path = require("path");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const banshee = require("./Routes/banshee");
const Vendorpage = require("./Routes/Vendorpage");
const wishList = require("./Routes/wishList");
const gunPic = require("./Routes/gunPic");
const gunPicView = require("./Routes/gunPicView");
const gunIcon = require("./Routes/gunIcons");
const perkIcon = require("./Routes/perkIcons");
const currentVendorSales = require("./Routes/getCurrentVendorSales");
const allVendorSales = require("./Routes/getAllVendorSales");
const getUserId = require("./Routes/getUserId");
const saveWishLIstedItem = require("./Routes/saveWishListedItem");
const getUsersWishListedSales = require("./Routes/getUsersWishListedSales");
const editWishlistedItem = require("./Routes/editWishlistedItem");
const deleteWishlistedItem = require("./Routes/deleteWishlistedItem");
const checkWishlistedItems = require("./Routes/checkForWishListedItem");
const corsOptions = {
  origin: "http://127.0.0.1:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/gunPic", gunPic);
app.use("/gunPicView", gunPicView);
app.use("/", Vendorpage);
app.use("/banshee", banshee);
app.use("/wishlist", wishList);
app.use("/gunIcon", gunIcon);
app.use("/perkIcon", perkIcon);
app.use("/api/currentVendorSales", currentVendorSales);
app.use("/api/allVendorSales", allVendorSales);
app.use("/api/getUserId", cors(corsOptions), getUserId);
app.use("/api/saveWishListedItem", cors(corsOptions), saveWishLIstedItem);
app.use("/api/getUsersWishListedSales", cors(corsOptions), getUsersWishListedSales);
app.use("/api/editWishListedItem", cors(corsOptions), editWishlistedItem);
app.use("/api/deleteWishlistedItem", cors(corsOptions), deleteWishlistedItem);
app.use("/api/checkForWishListedItem", cors({ origin: "*" }), checkWishlistedItems);

const options = {
  cert: fs.readFileSync("Server/ssl/cert.pem"),
  key: fs.readFileSync("Server/ssl/key.pem"),
};

const server = https.createServer(options, app);
server.listen((port = 8000), () => {
  console.log(`Server now listening at https://localhost:${port}`);
});
/* app.listen(port = 8000, () => {
    console.log(`Server now listening at http://localhost:${port}`);
}); */
