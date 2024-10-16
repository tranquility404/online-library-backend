import mongoose from "mongoose";

export default function connectToMongo() {
    const mongoURI = process.env.MONGODB_URI;
    console.log(mongoURI);

    mongoose.connect(mongoURI)
        .then(() => {
            console.log("db connected");
        })
        .catch(err => {
            console.log(err);
        });

    return mongoose.connection;
} 