const express = require('express');
const { Paymentpass } = require('../middleware/paymentPass');
const router = express.Router();

router.get("/", Paymentpass ,(req,res)=>{
    return res.render("movie");
});

module.exports = router;