const fs = require('fs')

const bansheeInventory = (req, res, next) => {
    const data = fs.readFileSync('Cache/ItemNameManifest.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
        }
    })
    res.json(JSON.parse(data))
}
module.exports = bansheeInventory
