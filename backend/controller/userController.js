const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");

const getUserAssets = expressAsyncHandler(async (req,res)=>{
    const id = req.params.id || req.user._id;
    const user = await User.findById(id).populate("assetsOwned");
    if(!user){
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200);
    res.json(user.assetsOwned);
});

module.exports = {getUserAssets};