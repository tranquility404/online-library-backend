import express from "express";
import userModel from "../models/user.js";
import genreModel from "../models/genre.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/", isAdmin, async (req, res) => {
    const users = await userModel.find({});
    const genres = await genreModel.find({});
    res.render("index", {users, genres});
});

router.get("/register", isAdmin, (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/rename/:id", isAdmin, async (req, res) => {
    const id = req.params.id;
    if (!id) return;

    const user = await userModel.findById(id);
    res.render("changeUsername", {user});
});

router.get("/edit-genre/:id", isAdmin, async (req, res) => {
    const id = req.params.id;
    if (!id) return;

    const genre = await genreModel.findById(id);
    res.render("changeUsername", {genre});
});

router.post("/rename-genre/:id", isAdmin, async (req, res) => {
    const id = req.params.id;
    const {name} = req.body;

    const user = await genreModel.findOneAndUpdate({_id: id}, {name});
    console.log("rename success");
    
    res.redirect("/admin");
    // res.status(200).send("Name Updated Successfully!");
});

const adminRouter = router;
export default adminRouter;
