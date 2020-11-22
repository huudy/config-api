const express = require('express')
require('./db/mongoose')
var cors = require('cors')
const configRouter = require('./routers/config.route')
const dbState = require('./middleware/dbState')
var log4js = require('log4js');
log4js.configure('./environments/log4js.json');

var log = log4js.getLogger("app");


const app = express()
app.use(cors())
app.use(log4js.connectLogger(log4js.getLogger("http"), {
    level: 'auto'
}));
log.info('Setting up the application...')
app.use(dbState)
app.use(express.json())
app.use(configRouter)

module.exports = app