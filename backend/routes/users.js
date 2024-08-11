const express = require("express");
const router = express.Router();
const {
    getUserAssets
} = require("../controller/userController");
const {authMiddleware} = require("../middlewares/authMiddleware");

router.get("/:id/assets", getUserAssets);
//since it's not secure that the user id needed to be passed in params so i created a authenticated version in the same controller function which will handle both the condition which can be seen below and in ../controller/userController

router.get("/assets", authMiddleware, getUserAssets);
module.exports = router;