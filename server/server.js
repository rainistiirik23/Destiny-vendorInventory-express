const express = require('express');
const app = express();
const banshee = require('./Routes/banshee');
const Vendorpage = require('./Routes/Vendorpage')
const wishList = require('./Routes/wishList');

app.use(express.urlencoded({ extended: false }));
app.use(Vendorpage);
app.use('/banshee', banshee);
app.use('/wishlist', wishList);

app.listen(port = 8000, () => {
    console.log(`Server now listening at http://localhost:${port}`)
});
