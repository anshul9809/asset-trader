const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUser
} = require("../controller/authController")
const {authMiddleware} = require("../middlewares/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, getUser);

module.exports = router;