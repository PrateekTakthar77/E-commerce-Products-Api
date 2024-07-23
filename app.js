// if (process.env.NODE_ENV === "dev") {
const dotenv = require("dotenv");
dotenv.config();

//
const cors = require("cors");
const express = require("express");
const mongoConnect = require("./helpers/db");
const productRouter = require("./routes/Products.routes");
const errorReqRouter = require("./middlewares/errorRouteHandler");

//Connecting MongoDB
mongoConnect();
const app = express();
// parse REQ data
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//cors
app.use(cors());

app.get("/", (req, res) => {
    res.send(`Welcome To E-Commerce Project Server Created by Prateek Takthar`);
});

app.use(
    "/api/products",
    (req, res, next) => {
        next();
    },
    productRouter,
);

//error handler -----
app.use(
    "/",
    (res, req, next) => {
        next();
    },
    errorReqRouter,
);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server Started on port: ", PORT);
});
