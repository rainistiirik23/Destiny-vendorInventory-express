const path = require('path');
const Vendorpage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../', 'Public/Views/Vendorpage/index.html'));
};

module.exports = Vendorpage;
