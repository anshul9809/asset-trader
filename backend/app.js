require("dotenv").config();
const express = require("express");
const app  = express();
const db = require("./config/db");
const cors = require("cors")
const {errorHandler, notFound} = require("./middlewares/errorHandler")

app.use(express.json());
app.use(cors());

app.use("/", require("./routes/index"));

app.use(notFound);
app.use(errorHandler);


module.exports = app;
