const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/authMiddleware");
const {
    negotiateRequest,
    acceptRequest,
    denyRequest,
    getRequest
} = require("../controller/requestController");

router.put("/:id/negotiate", authMiddleware, negotiateRequest);
router.put("/:id/accept", authMiddleware, acceptRequest);
router.put("/:id/deny", authMiddleware, denyRequest);
router.get("/:id", authMiddleware, getRequest);

module.exports = router;