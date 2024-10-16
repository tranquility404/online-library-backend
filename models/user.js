import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    roles: {
        type: Array,
        default: ["USER"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model('user', userSchema);
export default userModel;