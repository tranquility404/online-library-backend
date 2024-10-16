import express from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import userModel from "../models/user.js";
import bookModel from "../models/book.js";
import genreModel from "../models/genre.js";
import cloudFileModel from "../models/cloudFile.js";
import { storage } from "../app.js";

export default function usersRouter() {

    const router = express.Router();

    router.get("/", (req, res) => {
        res.send("Hello, I'm Users Route...")
    });

    router.get("/status", isLoggedIn, (req, res) => {
        res.sendStatus(200);
    });

    router.get("/logout", isLoggedIn, (req, res) => {
        res.clearCookie("token");
        res.status(200).send("Logged Out Successfully");
    });

    router.post("/rename/:id", isLoggedIn, async (req, res) => {
        const id = req.params.id;
        const { name } = req.body;

        const user = await userModel.findOneAndUpdate({ _id: id }, { name });
        console.log("rename success");

        res.redirect("/admin");
        // res.status(200).send("Name Updated Successfully!");
    });

    router.get("/genre", isLoggedIn, async (req, res) => {
        const genres = await genreModel.find();
        res.status(200).send(genres);
    });

    router.get("/books", isLoggedIn, async (req, res) => {
        const { genre, author, sort, limit } = req.query;

        let filters = {};
        if (genre)
            filters["genre"] = genre;
        if (author)
            filters["author"] = author;

        let query = bookModel.find(filters);
        if (sort == "last")
            query = query.sort({ _id: -1 });
        if (limit)
            query = query.limit(limit);

        console.log("/books request received");
        console.log(filters);
        console.log(sort, limit);

        const books = await query.exec();
        res.send(books);
    });

    router.get("/read-book/:id", isLoggedIn, async (req, res) => {
        const bookId = req.params.id;
        const book = await bookModel.findById({ _id: bookId });

        const fileName = `${book.genre}/${bookId}/book.epub`;

        const cacheFile = await cloudFileModel.findById({ _id: fileName });
        console.log(cacheFile);

        if (cacheFile) {
            const now = Date.now();
            const expiry = cacheFile.expiresAt;

            if (expiry - now > 0) {
                let a = new Date(now).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                let b = new Date(expiry).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                console.log("returning cached...", a, b, cacheFile.url);
                res.status(200).send(cacheFile.url);
                return;
            }
        }

        // const file = ;
        const expiresAt = Date.now() + 30 * 60 * 60 * 1000; // 30 hrs from now

        const options = {
            version: 'v4',
            action: 'read',
            expires: expiresAt
        };

        console.log("storage", storage);

        const [url] = await storage.bucket(process.env.BOOK_BUCKET).file(fileName).getSignedUrl(options);

        if (!cacheFile)
            await cloudFileModel.create({
                _id: fileName,
                url,
                expiresAt
            });
        else
            await cloudFileModel.updateOne(
                { _id: fileName },
                { url, expiresAt },
                { runValidators: true }
            );

        console.log("creating new url...");
        res.status(200)
            .send(url);
        // res.send(`https://storage.googleapis.com/${process.env.BOOK_BUCKET}/${book.genre}/${bookId}/book.epub`)
    });

    router.get("/quiz/:id", isLoggedIn, async (req, res) => {
        const bookId = req.params.id;
        const book = await bookModel.findById({ _id: bookId });

        const fileName = `${book.genre}/${bookId}/chapter-1-quiz.json`;

        const cacheFile = await cloudFileModel.findById({ _id: fileName });
        console.log(cacheFile);

        if (cacheFile) {
            const now = Date.now();
            const expiry = cacheFile.expiresAt;

            if (expiry - now > 0) {
                console.log("returning cached...");
                res.status(200).send(cacheFile.url);
                return;
            }
        }

        const file = storage.bucket(process.env.BOOK_BUCKET).file(fileName);
        const expiresAt = Date.now() + 30 * 60 * 60 * 1000; // 30 hrs from now

        const options = {
            version: 'v4',
            action: 'read',
            expires: expiresAt
        };

        const [url] = await file.getSignedUrl(options);

        if (!cacheFile)
            await cloudFileModel.create({
                _id: fileName,
                url,
                expiresAt
            });
        else
            await cloudFileModel.updateOne(
                { _id: fileName },
                { url, expiresAt },
                { runValidators: true }
            );

        console.log("creating new url...");
        res.status(200)
            .send(url);
        // res.send(`https://storage.googleapis.com/${process.env.BOOK_BUCKET}/${book.genre}/${bookId}/book.epub`)
    });

    return router;
}
