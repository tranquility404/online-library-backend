import express from "express";
import { register, login } from "../controllers/authentication.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hey I'm Public Route...");
});

router.post("/register", register);

router.post("/login", login);

const publicRouter = router;
export default publicRouter;
