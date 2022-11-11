const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'Public')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Public/index.html'))
})
/* app.get('vendorpage', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Public/index.html'))
}) */
app.get('/wishlist', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Public/index.html'))
})
app.listen(port = 8000, () => {
    console.log(`Server now listening at http://localhost:${port}`)
})
