  
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.use(morgan("tiny"));

const ENV = process.env.NODE_ENV || 'dev';

const config = dotenv.config({
    path: `./configs/${ENV}.env`
}).parsed;


mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify: false
}).then(() => console.log("Succesfully connected to DB"));

const db = require("./models");

app.use((req, res, next) => {
    req.db = db;
    next();
});



const router = require("./routes");

app.use("/", router);

app.listen('3000', () => {
    console.log(`listening to port ${3000}...`);
});