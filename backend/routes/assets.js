const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middlewares/authMiddleware");
const {upload} = require("../config/cloudinary");
const {
    createAssetsDraft,
    updateAssetsDraft,
    listAsset,
    getAsset
} = require("../controller/assetController");

router.put("/:id/publish", authMiddleware, listAsset);
router.post("/", authMiddleware, upload.single('image'), createAssetsDraft);
router.post("/:id", authMiddleware, upload.single('image'), updateAssetsDraft);
router.get("/:id", authMiddleware, getAsset);

module.exports = router;