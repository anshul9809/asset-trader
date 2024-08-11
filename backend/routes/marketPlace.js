const express = require("express");
const router = express.Router();
const {getMarketPlaceAssets} = require("../controller/assetController");

router.get("/assets", getMarketPlaceAssets);

module.exports = router;