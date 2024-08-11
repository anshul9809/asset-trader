const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Please add Email"],
        unique:true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password:{
        type:String,
        required:[true, "Please add Password"],
        select:false
    },
    username:{
        type:String,
        required:[true, "Please add Username"],
        unique:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    assetsOwned:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Assets"
        }
    ],
    assetsCreated:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Assets"
        }
    ]

},
{
    timestamps:true
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);