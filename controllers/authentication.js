import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

export async function register(req, res) {
    let { name, email, password } = req.body;

    const entry = await userModel.findOne({ "email": email });
    if (entry) {
        res.status(406).send("User already exists");
        return;
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            await userModel.create({
                name,
                email,
                password: hash
            })

            var token = jwt.sign({ email: email }, "Y3z$u47N5Pl&s%3Kj7X1mQeV9cLw2H8d!RkFs@0PnBt");
            res.cookie("token", token, {
                httpOnly: true,
                secure: true, // Ensure this is set to true in production (over HTTPS)
                sameSite: 'None',
                maxAge: 1000 * 60 * 60 * 24 * 31    // 31 days
              });
            res.status(200).send("User Created");
        });
    });
}


export async function login(req, res) {
    const entry = await userModel.findOne({ email: req.body.email })

    if (!entry) {
        res.status(404).send("User not found");
        return;
    }

    bcrypt.compare(req.body.password, entry.password, function(err, result) {
        if (result) {
            var token = jwt.sign({ email: entry.email }, "Y3z$u47N5Pl&s%3Kj7X1mQeV9cLw2H8d!RkFs@0PnBt");
            res.cookie("token", token, {
                httpOnly: true,
                secure: true, // Ensure this is set to true in production (over HTTPS)
                sameSite: 'None',
                maxAge: 1000 * 60 * 60 * 24 * 31    // 31 days
              });
            res.status(200).send("Login Successfull");
        } else {
            res.sendStatus(401);
        }
    });
};