const expressAsyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");

const User = require("../models/User");

const registerUser = expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400); // Bad Request
        throw new Error("Please add all the fields");
    }

    // Check if the email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        res.status(409); // Conflict
        throw new Error("Email already exists");
    }
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
        res.status(409); // Conflict
        throw new Error("Username already exists");
    }

    const user = await User.create(req.body);
    if (!user) {
        res.status(500); // Internal Server Error
        throw new Error("Failed to create user");
    }
    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({
        message: "User created successfully",
        user: userObj,
        token
    });
});

const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400); // Bad Request
        throw new Error("Please add all the fields");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        res.status(404); // Not Found
        throw new Error("User not found");
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        res.status(401); // Unauthorized
        throw new Error("Invalid password");
    }
    const userObj = user.toObject();
    delete userObj.password;
    const token = generateToken(user._id);
    return res.status(200).json({
        message: "Login successful",
        user: userObj,
        token
    });
});

module.exports = {
    registerUser,
    loginUser
};
