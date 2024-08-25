const { emailValidation } = require("../helper/helper");
const bcrypt = require('bcrypt');
const User = require("../model/userModel");

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: 'idbmannaf@gmail.com',
        pass: 'kdmzyciyzfkygref',
    }
});
let registrationController = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        let user = new User();
        user.name = name;
        user.email = email;
        user.password = hash;
        await user.save();

        const mailOptions = {
            from: 'noreply@email.com',
            to: user.email,
            subject: 'Email Verification',
            html: `
            
            <!DOCTYPE html>
                    <html lang="en">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title></title>
                    </head>
                    <h1>Dear${user.name} </h1>

                    <body>
                        <a href="http://localhost:8000/${user.email}">Click here</a> to verify

                    </body>

                    </html>
`
        };

        // Send the email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });


        res.send({
            "message": "User saved successfully",
            user: user
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({ error: errors.join(', ') });
        } else if (error.code === 11000) {
            return res.status(400).send({ error: "Email already exists" });
        } else {
            return res.status(400).send({ error: error.message });
        }
    }

}

module.exports = registrationController