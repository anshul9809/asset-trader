const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const Request = require("../models/Request");
const {validateMongoDbId} = require("../utils/validateMongoDbId");

const getUserAssets = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id || req.user._id;
    validateMongoDbId(id);
    const user = await User.findById(id).populate("assetsOwned");
    if(!user){
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200);
    res.json(user.assetsOwned);
});

const getUserRequests = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id || req.user._id;
    validateMongoDbId(id);
    const requests = await Request.find({proposedBy:id})
    .populate("proposedAsset")
    .select("-proposedBy");
    if(!requests){
        res.status(404);
        throw new Error("Requests not found");
    }
    res.status(200).json(requests);
});
module.exports = {
    getUserAssets,
    getUserRequests
};