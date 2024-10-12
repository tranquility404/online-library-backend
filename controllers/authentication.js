const userModel = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var user = require("../models/user");

module.exports.register = async (req, res) => {
    let { name, email, password } = req.body;

    const entry = await userModel.findOne({ "email": email });
    if (entry) {
        res.status(406).send("User already exists");
        return;
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            await user.create({
                name,
                email,
                password: hash
            })

            var token = jwt.sign({ email: email }, "Y3z$u47N5Pl&s%3Kj7X1mQeV9cLw2H8d!RkFs@0PnBt");
            res.cookie("token", token, {
                httpOnly: true,
                secure: true, // Ensure this is set to true in production (over HTTPS)
                sameSite: 'Lax',
              });
            res.status(200).send("User Created");
        });
    });
}


module.exports.login = async (req, res) => {
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
                sameSite: 'Lax',
              });
            res.status(200).send("Login Successfull");
        } else {
            res.sendStatus(401);
        }
    });
};