const mongoose = require('mongoose')
const configModel = require('../../src/models/config.model')

const configOne = {
    client: 'android',
    version: 1,
    key: 'margin',
    value :'10'
}
const configTwo = {
    client: 'android',
    version: 1,
    key: 'font_size',
    value :'10'
}
const configThree = {
    client: 'android',
    version: 1,
    key: 'bold',
    value :'true'
}

const setupDatabase = async () => {
    await configModel.deleteMany()
    // await new configModel(configOne).save()
    // await new configModel(configTwo).save()
    // await new configModel(configThree).save()
}

module.exports = {
    configOne,
    configTwo,
    configThree,
    setupDatabase
}