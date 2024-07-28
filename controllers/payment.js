const razorpay = require('razorpay');
const User = require('../models/user');

async function handleTransaction(req, res) {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).send('Amount is required');
    }

    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "order_rcptid_11"
    };

    try {
        const order = await razorpay.orders.create(options);
        await User.findOneAndUpdate({ hasAccess: true }, { new: true });
        res.json(order);
    } catch (error) {
        console.error('Error creating order or updating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    handleTransaction
};