const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
    name: String,
});

module.exports = mongoose.model('genre', genreSchema);