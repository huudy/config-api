const request = require('supertest')
const app = require('../src/app')
const configModel = require('../src/models/config.model')
const {
    configOne,
    configOneUpdate,
    configUpdateTwo,
    setupDatabase
} = require('./fixtures/db')

beforeAll(setupDatabase)

describe('POST /config', () => {

    test('Should create a new config', async () => {
        const response = await request(app).post('/config').send({ ...configOne}).expect(201)
    
        const config = await configModel.findOne(configOne)
        expect(config).not.toBeNull()
    
        expect(response.body.client).toBe(config.client)
        expect(response.body.version).toBe(config.version)
        expect(response.body.key).toBe(config.key) 
        expect(response.body.value).toBe(config.value) 
    })
    
    test('Should not create a new config and return status 400 if already exists', async () => {
        await request(app).post('/config').send({ ...configOne}).expect(400)
    })
})

describe('PATCH /config', () => {
    test('Should patch a config if exists', async () => {
        const response = await request(app).patch('/config').send({ ...configOneUpdate}).expect(200)
        const config = await configModel.findOne({client:configOne.client,version:configOne.version,key:configOne.key})
        expect(config).not.toBeNull()    
        expect(response.body.value).toBe(configOneUpdate.value)
    })
})
describe('GET /config/:client', () => {
    test('Should get a config for a specified client', async () => {
        await request(app).get('/config/android').send().expect(200)
    })
    test('Should return 404 for a client that does not exist', async () => {
        await request(app).get('/config/web').send().expect(404)
    })
})
describe('GET /config/:client/:version', () => {
    test('Should get a config object for a specific version of a client', async () => {
        const response = await request(app).get('/config/android/1').send().expect(200)
        expect(Object.keys(response.body).length).toEqual(3)
    })
})
describe('PUT /config?:client/:version', () => {
    test('Should replace a config for a specific version of a client', async () => {
        const response = await request(app).put('/config/android/1').send({...configUpdateTwo}).expect(200)
    
        expect(response.body.client).toBe(configUpdateTwo.client)
        expect(response.body.version).toBe(configUpdateTwo.version)
        expect(response.body.key).toBe(configUpdateTwo.key)
        expect(response.body.value).toBe(configUpdateTwo.value)
    })
    test('Should create a new config for a specific version of a client if does not exist yet', async () => {
        const response = await request(app).put('/config/android/10').send({...configUpdateTwo}).expect(200)
    
        expect(response.body.client).toBe(configUpdateTwo.client)
        expect(response.body.version).toBe(10)
        expect(response.body.key).toBe(configUpdateTwo.key)
        expect(response.body.value).toBe(configUpdateTwo.value)
    })
})
describe('PATCH /config/:client/:version', () => {
    test('Should patch a config for a specific version of a client', async () => {
        const response = await request(app).patch('/config/android/1').send({...configOneUpdate}).expect(200)
        expect(response.body.client).toBe(configUpdateTwo.client)
        expect(response.body.version).toBe(configUpdateTwo.version)
        expect(response.body.key).toBe(configOneUpdate.key)
        expect(response.body.value).toBe(configOneUpdate.value)
    })
    test('Should not replace a config for a if specified client does not exist', async () => {
        await request(app).patch('/config/web/1').send({...configUpdateTwo}).expect(404)
    })
    test('Should not replace a config if a specified version number does not exist', async () => {
        await request(app).patch('/config/android/100').send({...configUpdateTwo}).expect(404)
    })
    
})
describe('DELETE /config/:client/:version', () => {
    test('Should delete a config for a specific version of a client', async () => {
        await request(app).delete('/config/android/1').send({...configOneUpdate}).expect(204)
    })   
    
})