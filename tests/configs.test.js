const request = require('supertest')
const app = require('../src/app')
const configModel = require('../src/models/config.model')
const {
    configOne,
    configTwo,
    configThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a new config', async () => {
    const response = await request(app).post('/config').send({ ...configOne}).expect(201)

    // Assert that the database was changed correctly
    const config = await configModel.findOne(configOne)
    expect(config).not.toBeNull()

    // Assertions about the response
    expect(response.body.client).toBe(config.client)
    expect(response.body.version).toBe(config.version)
    expect(response.body.key).toBe(config.key)
    expect(response.body.value).toBe(config.value)
})
