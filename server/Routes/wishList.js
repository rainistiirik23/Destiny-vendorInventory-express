const express = require('express');
const router = express.Router();
const fs = require('fs');
const RenderWishList = require('../Controllers/wishlist')
router.get('/', RenderWishList)

module.exports = router
