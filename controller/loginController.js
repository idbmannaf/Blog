const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const loginController = async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email })
    if (!user) {
        return res.send("User not found")
    }
    bcrypt.compare(password, user.password).then(function (result) {

        if (!user.emailVerify) {
            return res.send("Email is not verified")
        }
        if (!result) {
            res.send("Password is incorrect")
        }
        res.send({
            message: "Login Success",
            user: user
        })
    });
}
module.exports = loginController