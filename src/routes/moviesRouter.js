const express = require('express');
const { Paymentpass } = require('../middleware/paymentPass');
const { restrictToLoggedInUserOnly } = require('../middleware/auth');
const router = express.Router();

router.get("/", restrictToLoggedInUserOnly, Paymentpass, (req, res) => {
    if (!req.user) return res.redirect("/user/login");
    
    return res.render("movie", {
        name: req.user.name,
        email: req.user.email,
        BASE_URL: process.env.BASE_URL
    });
});

module.exports = router;