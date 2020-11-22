const mongoose = require('mongoose')
var log = require('log4js').getLogger("mongoose");

var db = mongoose.connection;

db.on('connecting', function () {
    log.debug('connecting to MongoDB...');
});

db.on('error', function (error) {
    log.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});
db.on('connected', function () {
    log.debug('MongoDB connected!');
});
db.once('open', function () {
    log.debug('MongoDB connection opened!');
});
db.on('reconnected', function () {
    log.debug('MongoDB reconnected!');
});
db.on('disconnected', function () {
    log.debug('MongoDB disconnected!');
    setTimeout(() => {
        mongoose.connect(process.env.MONGODB_URI, {
            server: {
                auto_reconnect: true
            }
        });
    }, 30000);

});
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});