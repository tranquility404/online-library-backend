import mongoose from "mongoose";

const cloudFileSchema = mongoose.Schema({
    _id: String,
    url: String,
    expiresAt: Number
});
const cloudFileModel = mongoose.model('cloudFile', cloudFileSchema);
export default cloudFileModel;