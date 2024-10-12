const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    thumbnail: String,
    files: String
});

module.exports = mongoose.model('book', bookSchema);