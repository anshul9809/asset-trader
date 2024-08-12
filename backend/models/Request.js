const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    proposedPrice:{
        type:Number,
        required:[true, "Please provide a proposed price"],
    },
    proposedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    proposedAsset:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assets',
    },
    status:{
        type:String,
        enum: ['pending', 'accepted', 'denied'],
        default: "pending"
    }

});

module.exports = mongoose.model("Request", RequestSchema);