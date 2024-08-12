const expressAsyncHandler = require("express-async-handler");
const {validateMongoDbId} = require("../utils/validateMongoDbId");
const User = require("../models/User");
const Assets = require("../models/Assets");
const Request = require("../models/Request");


const calculateAverageTradingPrices = (tradingJourney)=>{
    const totalPrices = tradingJourney.reduce((sum, entry)=> sum + entry.price, 0);
    const averagePrice = totalPrices / tradingJourney.length;
    return averagePrice;
}

const createRequest = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    const {proposedPrice} = req.body;
    if(!proposedPrice){
        res.status(400);
        throw new Error("Please enter a proposed price");
    }
    validateMongoDbId(id);
    
    const userId = req?.user?._id;
    const asset = await Assets.findById(id);
    if(!asset) {
        res.status(404);
        throw new Error("Asset not found");
    }
    if(asset.currentHolder.toString() === userId.toString()){
        res.status(400);
        throw new Error("You already owns this asset");
    }
    const user = await User.findById(userId);
    if(!user) {
        res.status(404);
        throw new Error("User not found");
    }
    const request = await Request.create({
        proposedAsset:asset._id,
        proposedBy:userId,
        proposedPrice
    });
    if(!request){
        res.status(500);
        throw new Error("Failed to create request");
    }
    asset.proposals = asset.proposals+1;
    await asset.save();

    res.status(201).json({
        message:"Purchase request sent",
        requestId: request._id
    });
});

const negotiateRequest = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    const {newProposedPrice} = req.body;
    if(!newProposedPrice){
        res.status(400);
        throw new Error("Please enter a new proposed price");
    }
    const userId = req?.user?._id;
    const request = await Request.findById(id).populate("proposedAsset");
    if(!request){
        res.status(404);
        throw new Error("Request not found");
    }
    if(request.status != "pending"){
        res.status(400);
        throw new Error(`Request has already been ${request.status}`);
    }
    if(userId.toString() != request.proposedBy.toString() && userId.toString() != request.proposedAsset.currentHolder.toString()){
        res.status(400);
        throw new Error("You are not authorized to negotiate this request");
    }
    request.proposedPrice = newProposedPrice;
    await request.save();
    res.status(200).json({
        message: "Negotiation updated",
        requestId: request._id
    });
});

const acceptRequest = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    const request = await Request.findById(id).populate("proposedAsset");
    if(!request){
        res.status(404);
        throw new Error("Request not found");
    }
    if(request.status != "pending"){
        res.status(400);
        throw new Error(`Request has already been ${request.status}`)
    }
    const userId = req?.user?._id;
    if(userId.toString() != request.proposedAsset.currentHolder.toString()){
        res.status(400);
        throw new Error("You do not hold this asset to accept request");
    }
    const newOwner = await User.findById(request.proposedBy);
    const newAsset = await Assets.findById(request.proposedAsset);
    const prevOwner = await User.findById(userId);

    //changing the owner of asset
    newAsset.currentHolder = newOwner._id;
    
    //adding the transaction to trading journey
    newAsset.tradingJourney.push({
        holder: newOwner._id,
        date:Date.now(),
        price:request.proposedPrice
    });
    //setting the lastTradingPrice, increasing number of transfers and setting the averageTradingPrice
    newAsset.lastTradingPrice = request.proposedPrice;
    newAsset.numberOfTransfers += 1;
    newAsset.averageTradingPrice = calculateAverageTradingPrices(newAsset.tradingJourney);
    //setting the proposals for asset back to 0 and isListed as false
    newAsset.proposals = 0;
    newAsset.isListed = false;
    
    //changing the ownership in the User model
    prevOwner.assetsOwned.pull(newAsset._id);
    newOwner.assetsOwned.push(newAsset._id);

    // saving all the changes
    await newAsset.save();
    await newOwner.save();
    await prevOwner.save();
    request.status = "accepted";
    request.save();
    res.status(200).json({
        message:"Request accepted, holder updated",
    });
});

const denyRequest = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    const request = await Request.findById(id);
    if(!request){
        res.status(404);
        throw new Error("Request not found");
    }
    if(request.status != "pending"){
        res.status(400);
        throw new Error(`Request already ${request.status}`);
    }
    //changing the status of the request to denied
    request.status = "denied";
    //saving the changes
    await request.save();
    res.status(200).json({
        message:"Request denied",
    });
});

const getRequest = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    const request = await Request.findById(id).populate("proposedAsset");
    if(!request){
        res.status(404);
        throw new Error("Request not found");
    }
    // check if use is authorized to check the request
    if(req?.user?._id.toString() != request.proposedBy.toString() && request.proposedAsset.currentHolder.toString()){
        res.status(403);
        throw new Error("You are not authorized to check this request");
    }
    res.status(200).json(request);

});

module.exports = {
    createRequest,
    negotiateRequest,
    acceptRequest,
    denyRequest,
    getRequest
}