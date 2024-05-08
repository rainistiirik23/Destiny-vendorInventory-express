const express = require('express')
const path = require('path');

const RenderWishList = (req, res) => {
    res.sendFile(path.join(__dirname, '../../', 'Public/Views/Wishlistpage/index.html'));
};

module.exports = RenderWishList;
