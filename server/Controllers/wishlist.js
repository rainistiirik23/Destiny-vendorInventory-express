const path = require('path');
const RenderWishList = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Public/index.html'))
};
module.exports = RenderWishList;
