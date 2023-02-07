const express = require('express');
const router = express.Router();
const path = require('path');


router.use('/', express.static(path.join(__dirname, '../', 'Assets/Icons/Perks')));
router.get('/');

module.exports = router
