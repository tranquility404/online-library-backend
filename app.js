import express from "express";
import cors from 'cors';
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
if (process.env.NODE_ENV == "local")
  dotenv.config({ path: path.resolve(__dirname, ".env.local") });
else if (process.env.NODE_ENV == "production")
  dotenv.config({path: path.resolve(__dirname, ".env.production")});

import {connectToGc} from "./config/gcStorage.js";
import connectToMongo from "./config/db.js";
connectToMongo();
export const storage = connectToGc();

import publicRouter from "./routes/publicRoute.js";
import adminRouter from "./routes/adminRoute.js";
import usersRouter from "./routes/usersRoute.js";
import cookieParser from "cookie-parser";
import { allowedOrigins } from "./config/config.js";
import { fileURLToPath } from "url";

const corsOptions = {
  origin: allowedOrigins(), // specify your front-end origin
  credentials: true // allow credentials (cookies, headers, etc.)
};

const app = express();

app.use(cors(corsOptions));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser())

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
    res.send("I work");
});

app.use("/public", publicRouter);
app.use("/admin", adminRouter);
app.use("/user", usersRouter());

console.log(process.env.PORT);

app.listen(`${process.env.PORT}`, () => {
    console.log(process.env.NODE_ENV);
    console.log(process.env.PORT);

});