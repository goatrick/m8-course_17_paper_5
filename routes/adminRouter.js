import express from "express";
const router = express.Router();


router.get("/", (req, res) => {
    res.send("Hi I am an admin Router");
});


export default router;