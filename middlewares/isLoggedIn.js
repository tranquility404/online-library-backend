const userModel = require("../models/user");
var jwt = require('jsonwebtoken');

module.exports.isLoggedIn = async (req, res, next) => {
    console.log(req.cookies);
    
    if (!req.cookies) {
        res.status(401).send("You need to login first");
        return;
    }

    if (!req.cookies.token || req.cookies.token == '') {
        res.status(401).send("You need to login first");
        return;
    }

    try {
        var decoded = jwt.verify(req.cookies.token, "Y3z$u47N5Pl&s%3Kj7X1mQeV9cLw2H8d!RkFs@0PnBt");
        let entry = await userModel
        .findOne({ email: decoded.email})
        .select("-password");

        req.user = entry;
        next();
    } catch(err) {
        console.log(err);
        
        res.status(500).send("Something went wrong");
    }
};