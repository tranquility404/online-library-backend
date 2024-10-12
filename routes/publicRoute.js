const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authentication");

router.get("/", (req, res) => {
    res.send("Hey I'm Public Route...");
});

router.post("/register", register);

router.post("/login", login);

module.exports = router;
