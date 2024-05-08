const express = require('express');
const router = express.Router();
const path = require('path');
const RenderWishList = require('../Controllers/wishlist');

router.use('/', express.static(path.join(__dirname, '../../', 'Public/Views/Wishlistpage')));
router.get('/', RenderWishList);

module.exports = router
