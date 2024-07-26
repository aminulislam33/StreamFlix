require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');

const app = express();

port = process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
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
app.use("/user", userRouter);

app.get("/", (req,res)=>{
    return res.render("home");
});

app.listen(port, ()=>{
    console.log(`server is listening on ${port}`);
});