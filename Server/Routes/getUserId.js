const express = require("express");
const router = express.Router();
const getUserId = require("../Controllers/getUserId");

router.post("/", getUserId);

module.exports = router;
