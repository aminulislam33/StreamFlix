require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('../routes/user');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const staticRouter = require('../routes/staticRouter');
const cloudinary = require('cloudinary');
const moviesRouter = require('../routes/moviesRouter');

const app = express();

const port =  3001;

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
    });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
cloudinary.v2.config({
  cloud_name: 'dwr8472qb',
  api_key: '872674654568337',
  api_secret: process.env.CLOUDI_SECRET,
  secure: true,
});
app.use("/user", userRouter);
app.use("/movies", moviesRouter);
app.use("/", staticRouter);

app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});

module.exports = app;