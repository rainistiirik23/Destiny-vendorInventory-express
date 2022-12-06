const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const banshee = require('./Routes/banshee')
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, '..', 'Public')))
app.use('/banshee', banshee)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Public/index.html'))
})
app.get('/wishlist', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Public/index.html'))
})
app.listen(port = 8000, () => {
    console.log(`Server now listening at http://localhost:${port}`)
})
