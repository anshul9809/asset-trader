const mongoose = require("mongoose");

const AssetsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        enum:["draft", "published"],
        required:true
    },
    image:{
        type:String,
        default: "https://res.cloudinary.com/dnu2n1uz0/image/upload/v1721911080/profile_pictures/66a21f318b36454ee92f5eba_1721911079353.png",
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    currentHolder:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tradingJourney:[
        {
            holder:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            date:{
                type:Date,
                default:Date.now
            },
            price:{
                type:Number,
                required:true

            }
        }
    ],
    averageTradingPrice:{
        type:Number,
        default:0
    },
    lastTradingPrice:{
        type:Number,
        default:0
    },
    numberOfTransfers:{
        type:Number,
        default:0
    },
    isListed:{
        type:Boolean,
        default:false
    },
    proposals:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Assets", AssetsSchema);