const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
/* app.use(express.urlencoded()) */
app.use(express.static(path.join(__dirname, '..', 'Public')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Public/index.html'))
})
app.get('/banshee', (req, res) => {
    const data = fs.readFileSync('Cache/ItemNameManifest.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
        }
    })
    res.json(JSON.parse(data))
})
app.get('/wishlist', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Public/index.html'))
})
app.listen(port = 8000, () => {
    console.log(`Server now listening at http://localhost:${port}`)
})
