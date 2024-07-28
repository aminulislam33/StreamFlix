const User = require("../models/user");
const { getUser } = require("../service/auth");

async function Paymentpass(req, res, next) {
    const userUid = req.cookies.uid;

    if (!userUid) return res.redirect("/user/login");

    const TokenUser = getUser(userUid);

    if (!TokenUser) return res.redirect("/user/login")

    const user = await User.findOne({ email: TokenUser.email });

    if (user.hasAccess) {
        next();
    } else {
        return res.send("You don't have premium to watch movies");
    }
};

module.exports = {
    Paymentpass
}