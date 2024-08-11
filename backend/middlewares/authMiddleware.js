const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

module.exports.authMiddleware = expressAsyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                if (!user) {
                    res.status(404);
                    throw new Error("User not found");
                }
                req.user = user;
                next();
            }
        } catch (err) {
            res.status(401);
            throw new Error(err ? err.message : "Session expired, Please login again");
        }
    } else {
        res.status(401);
        throw new Error("There's no token attached");
    }
});