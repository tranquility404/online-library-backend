import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    thumbnail: String,
    files: String
});
const bookModel = mongoose.model('book', bookSchema);
export default bookModel;