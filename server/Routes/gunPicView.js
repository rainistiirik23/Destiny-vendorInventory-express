const express = require('express');
const router = express.Router();
const path = require('path');
const gunPicView = require("../Controllers/gunPicView");

router.use('/', express.static(path.join(__dirname, '../../', 'Public/Views/Gunview')));
router.get('/', gunPicView);

module.exports = router
