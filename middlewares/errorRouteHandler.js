const express = require("express");

const router = express.Router();

router
    .route("/*")
    .get((req, res) => {
        return res.send("We Don't Have Anything on this URL 😶‍🌫️");
    })
    .post((req, res) => {
        return res.send("Post Url Not Found");
    });

module.exports = router;
