const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;
console.log(mongoURI);


mongoose.connect(mongoURI)
    .then(() => {
        console.log("db connected");
    })
    .catch(err => {
        console.log(err);
    });

module.exports = mongoose.connection