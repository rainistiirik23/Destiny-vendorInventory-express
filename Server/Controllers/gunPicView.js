const path = require('path');
const express = require('express');
const app = express()


const gunPic = async (req, res) => {
    /*  res.sendFile(path.join(__dirname, '../../Pictures/screenshot.png')) */
    res.sendFile(path.join(__dirname, '../../', 'Public/Views/Gunview/index.html'));


};

module.exports = gunPic
