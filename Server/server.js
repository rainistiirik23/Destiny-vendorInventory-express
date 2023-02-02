const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const banshee = require('./Routes/banshee');
const Vendorpage = require('./Routes/Vendorpage');
const wishList = require('./Routes/wishList');
const gunPic = require('./Routes/gunPic');
const gunPicView = require('./Routes/gunPicView');
const fs = require('fs');

app.use(express.urlencoded({ extended: false }));
app.use('/gunPic', gunPic);
app.use('/gunPicView', gunPicView);
app.use('/', Vendorpage);
app.use('/banshee', banshee);
app.use('/wishlist', wishList);
const options = {
    cert: fs.readFileSync("Server/ssl/cert.pem"),
    key: fs.readFileSync("Server/ssl/key.pem")
};
const server = https.createServer(options, app)
server.listen(port = 8000, () => {
    console.log(`Server now listening at https://localhost:${port}`);
})
/* app.listen(port = 8000, () => {
    console.log(`Server now listening at http://localhost:${port}`);
}); */
