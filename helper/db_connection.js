const mongoose = require('mongoose')


const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("connected");
    })
}

module.exports = dbConnection