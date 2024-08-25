const User = require("../model/userModel");

let emailValidationController = async (req, res) => {
    let email = req.params.email;

    let existingUser = await User.findOne({ email: email });

    if (!existingUser) {
        return res.send("Email Not found")
    }

    if (existingUser.emailVerify) {
        return res.send("Email Already Verified")
    }
    existingUser.emailVerify = true;
    await existingUser.save()

    return res.send("Email Verified")
}

module.exports = emailValidationController;