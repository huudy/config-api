var mongoose = require('mongoose');

const dbState = async (req, res, next) => {
    try {
        let mongoStatus = mongoose.connection.readyState
        if (mongoStatus === 0 || mongoStatus === 3) {
            throw new Error()
        }
        next()
    } catch (e) {
        res.status(500).send({
            error: 'Mongo DB connection lost! Please try again in a moment...'
        })
    }
}

module.exports = dbState