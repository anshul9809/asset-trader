const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/assets", require("./assets"));
router.use("/marketplace", require("./marketPlace"));
router.use("/users", require("./users"));
router.use("/requests", require("./request"));

module.exports = router;