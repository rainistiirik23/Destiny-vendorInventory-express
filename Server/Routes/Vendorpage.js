const express = require('express');
const router = express.Router();
const path = require('path');
const Vendorpage = require("../Controllers/Vendorpage");

router.use('', express.static(path.join(__dirname, '../../', 'Public/Views/Vendorpage')));
router.get('', Vendorpage)

module.exports = router
