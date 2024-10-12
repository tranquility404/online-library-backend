const mongoose = require("mongoose");

const cloudFileSchema = mongoose.Schema({
    _id: String,
    url: String,
    expiresAt: Number
});

module.exports = mongoose.model('cloudFile', cloudFileSchema);