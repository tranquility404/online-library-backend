import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

export default async function isAdmin(req, res, next) {
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

        if (!entry) {
            res.sendStatus(404);
            return;
        }

        console.log(entry.roles);
        if (!entry.roles.includes("ADMIN")) {
            res.sendStatus(401);
            return;
        }

        req.user = entry;

        next();
    } catch(err) {
        console.log(err);
        
        res.status(500).send("Something went wrong");
    }
};