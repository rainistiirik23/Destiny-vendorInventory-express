const express = require('express');
const router = express.Router();
const bansheeInventory = require('../Controllers/banshee');

router.get('/', bansheeInventory)

module.exports = router
