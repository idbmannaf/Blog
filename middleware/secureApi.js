let secureApi = (req, res, next) => {
    if (req.headers.authorization === "jfljiojlf974874656") {
        next()
    } else {
        res.send("Unauthorized")
    }

}

module.exports = secureApi;