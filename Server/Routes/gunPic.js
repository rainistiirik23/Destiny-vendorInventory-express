const express = require('express');
const router = express.Router();
const path = require('path');
const gunPic = require("../Controllers/gunPic");

/* router.use('/', express.static(path.join(__dirname, '../../', 'Public/Views/Gunview'))); */
router.get('/', gunPic);

module.exports = router
