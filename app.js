const express = require("express");
const cors = require('cors');
const path = require("path");
const storage = require("./config/gcStorage");
const dotenv = require("dotenv");
const publicRoute = require("./routes/publicRoute");
const adminRoute = require("./routes/adminRoute");
const usersRoute = require("./routes/usersRoute");
const cookieParser = require("cookie-parser");
const listFilesAndFolders = require("./controllers/cloudStorage");


dotenv.config();
if (process.env.NODE_ENV == "local")
    dotenv.config({ path: path.resolve(__dirname, ".env.local") });
else if (process.env.NODE_ENV == "production")
    dotenv.config({path: path.resolve(__dirname, ".env.production")});

const db = require("./config/db");
const app = express();

console.log(process.env.MONGODB_URI);

const corsOptions = {
    origin: process.env.ORIGINS, // specify your front-end origin
    credentials: true // allow credentials (cookies, headers, etc.)
  };
  
app.use(cors(corsOptions));
async function setCorsConfiguration() {
    const corsConfiguration = [
      {
        origin: process.env.ORIGINS,  // Allow your frontend origin
        method: ['GET', 'HEAD', 'OPTIONS'],  // Allowed methods
        responseHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
        maxAgeSeconds: 3600,                  // How long to cache the preflight response
      },
    ];
  
    try {
        const a = await storage.bucket(process.env.BOOK_BUCKET).setMetadata({cors: corsConfiguration});
        // console.log(a);
        
      console.log('CORS configuration updated successfully.');
    } catch (error) {
      console.error('Error updating CORS configuration:', error);
    }
}

setCorsConfiguration();

// async function  a() {
//     const [metadata] = await storage.bucket(process.env.BOOK_BUCKET).getMetadata();
//     console.log(metadata);

// }
// a();
// app.use(cors({
//     origin: '*', // Allow all origins
//     allowedHeaders: '*', // Allow all headers
//     methods: '*', // Allow all methods (GET, POST, PUT, DELETE, etc.)
//     credentials: true // Allow credentials (cookies, authorization headers, etc.)
//   }));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser())

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
    res.send("I work");
});

app.use("/public", publicRoute);
app.use("/admin", adminRoute);
app.use("/user", usersRoute);

// listFilesAndFolders()

// const genre = require("./data/categories.json");
// const books = require("./data/library.books.json");
// const map = new Map();
// for (let i = 0; i < genre.length; i++)
//     map.set(genre[i]._id, genre[i].name);
// const json = JSON.parse(JSON.stringify(books));
// for (let i = 0; i < books.length; i++)
//     json[i]["genre"] = map.get(books[i].genre);

// console.log(JSON.stringify(json));

app.listen(`${process.env.PORT}`, () => {
    console.log(process.env.NODE_ENV);
    console.log(process.env.PORT);
    
});