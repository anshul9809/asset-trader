const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const Assets = require("../models/Assets")
const {validateMongoDbId} = require("../utils/validateMongoDbId");

const createAssetsDraft = expressAsyncHandler(async (req,res)=>{
    const {name, description, status} = req.body;
    let image;
    if(!name || !description){
        res.status(400);
        throw new Error("Please provide name and description");
    }
    if(req.file){
        image = req.file.path;
    }

    const asset = await Assets.create({
        name,
        description,
        status,
        image,
        creator: req.user._id,
        currentHolder: req.user._id
    });
    if(!asset){
        res.status(400);
        throw new Error("Failed to create asset");
    }
    const user = await User.findById(req.user._id);
    user.assetsCreated.push(asset._id);
    user.assetsOwned.push(asset._id);
    await user.save();
    res.status(201).json({
        message: "Asset created successfully",
        assetId:asset._id
    });
});

const updateAssetsDraft = expressAsyncHandler(async (req,res)=>{
    const {name, description, status} = req.body;
    const {id} = req.params;
    validateMongoDbId(id);
    let image;
    if(!name || !description || !status){
        res.status(400);
        throw new Error("Please fill all the required fields");
    }
    if(req.file){
        image = req.file.path;
    }
    const assetForCreatorChecking = await Assets.findById(id);
    if(!assetForCreatorChecking){
        res.status(404);
        throw new Error("Asset not found");
    }
    if(assetForCreatorChecking.currentHolder.toString() !== req.user._id.toString()){
        res.status(403);
        throw new Error("You are not the current holder of this asset");
    }
    const asset = await Assets.findByIdAndUpdate(id, {
        name,
        description,
        image,
        status
    },{
        new: true,
    });
    if(!asset){
        res.status(400);
        throw new Error("Failed to update asset");
    }
    res.status(200).json({
        message: "Asset created successfully",
        assetId: asset._id
    });
});

const listAsset = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);

    const asset = await Assets.findByIdAndUpdate(id, {isListed:true}, {new:true});
    if(!asset){
        res.status(400);
        throw new Error("Unable to publish asset");
    }
    res.status(200).json({
        message: "Asset published successfully",
    });
});

const getAsset = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);

    const asset = await Assets.findById(id)
    .populate({
        path: 'tradingJourney.holder',
        select: 'username'
    })
    .populate('creator')
    .populate('currentHolder');
    if(!asset){
        res.status(404);
        throw new Error("Asset not found");
    }
    res.status(200).json(asset);
});

//will be shifted to marketplace controller in case of expanding the project/product
const getMarketPlaceAssets = expressAsyncHandler(async (req,res)=>{
    const assets = await Assets.find({isListed:true})
    .populate({
        path: "currentHolder",
        select: "username id email"
    })
    .select("id name description image currentHolder lastTradingPrice proposals");
    if(assets.length === 0){
        return res.status(404).json({message: "No assets found"});
    }
    res.status(200).json(assets);
});




module.exports = {
    createAssetsDraft,
    updateAssetsDraft,
    listAsset,
    getAsset,
    getMarketPlaceAssets
};