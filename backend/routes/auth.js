const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser
} = require("../controller/authController")

router.post("/signup", registerUser);
router.post("/login", loginUser);

module.exports = router;