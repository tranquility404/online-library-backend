const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;
const dbName = process.env.DB;

mongoose.connect(mongoURI + dbName)
    .then(() => {
        console.log("db connected");
    })
    .catch(err => {
        console.log(err);
    });

module.exports = mongoose.connection