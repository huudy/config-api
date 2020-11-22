const express = require('express');
const { version } = require('mongoose');
const configModel = require('../models/config.model')
const router = new express.Router()
var log = require('log4js').getLogger("config");


router.post('/config', async (req, res) => {
    try {
        const config = new configModel({
            ...req.body,
        })
        let dbConfig = await configModel.findOne({
            client: config.client,
            version: Number(config.version),
            key: config.key         
        })
        console.log(dbConfig);
        if(dbConfig){
            res.status(400).send({error:`Config for client ${config.client} with key ${config.key} already exists!`})
        }else{
            await config.save()
            res.status(201).send(config)
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({error:`There was an error when creating config for client ${client}`,message:e.message})
    } 
}) //DONE

router.patch('/config', async (req, res) => {
    try {
	    let { client, version, key, value } = req.body;
        let dbConfig = await configModel.findOneAndUpdate(
            { client, version, key },
            { value },
            { new: true }
        );
        if (dbConfig) {
            res.status(200).send(dbConfig);
        } else {
            res.status(404).send({
                error: `Config for client ${client} could not be updated because it was not found in the DB`,
            });
        }
    } catch (e) {
        res.status(500).send({error:`There was an error when patching config for client ${client} version:${version}`,message:e.message})
    }
}) //DONE

router.get('/config/:client', async (req, res) => {
    try {
        let { client } = req.params;
        
        let match = { $match: { client: client } };
        let group = {
            $group: {
                _id: '$version',
                configs: { $push: '$$ROOT' },
                count: { $sum: 1 },
            },
        };
        let sort = { $sort: { _id: -1 } };
        let limit = { $limit: 1 };

        const config = await configModel.aggregate([match, group, sort, limit]);

        let configList = config
            .map((c) => {
                return c.configs;
            })
            .map((c) => {
                return c.map((conf) => {
                    return { [conf.key]: conf.value, version: conf.version };
                });
            })
            .shift();

        if (configList) {
            res.status(200).send(configList);
        } else {
            res
                .status(404)
                .send({ error: `Configs for client ${client} could not be found` });
        }
    } catch (e) {
        res.status(500).send({error:`There was an error when getting configs for client ${client}`,message:e.message})
    }
})

router.get('/config/:client/:version', async (req, res) => {
    try {
        let { client, version } = req.params;
			let match = { $match: { client: client } };
			let project = {
				$project: { _id: 1, version: 1, configs: { key: 1, value: 1 } },
			};
			let group = {
				$group: {
					_id: '$version',
					version: { $first: '$version' },
					configs: { $push: '$$ROOT' },
					count: { $sum: 1 },
				},
			};
            const config = await configModel.aggregate([match, group, project]);
            let filtered = config.filter((c) => {
				return c.version == version;
			});

			if (filtered.length > 0) {
				let configList = filtered
					.map((c) => {
						return c.configs;
					})
					.map((c) => {
						return c.map((conf) => {
							return { [conf.key]: conf.value };
						});
					})
					.shift()
					.reduce((obj, item) => {
						return { ...obj, ...item };
					}, {});

				res.send(configList);
			} else {
				res.status(404).send({
					error: `Configs for client ${client} and version ${version} do not exist!`,
				});
			}
    } catch (e) {
        res.status(500).send()
    }
})

router.put('/config/:client/:version', async (req, res) => {
    try {
        const { key, value } = req.body;
        const client = req.params.client;
        const version = Number(req.params.version);
        const config = { client, version, key, value };
        await configModel.replaceOne(
            { client: client, version: version, key: key },
            config
        );
        const result = await configModel.findOne(config);
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({
                error: `Configs for ${client} version ${version} with key ${config.key} could not be found`,
            });
        }
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/config/:client/:version', async (req, res) => {
    try {
        const { key, value } = req.body;
        const client = req.params.client;
        const version = Number(req.params.version);
        const dbConfig = await configModel.findOneAndUpdate(
            {
                client: client,
                version: version,
                key: key,
            },
            { value },
            {
                new: true,
            }
        );
        if (dbConfig) {
            res.status(200).send(dbConfig);
        } else {
            res.status(404).send({
                error: `Configs for ${client} version ${version} with key ${key} could not be found`,
            });
        }
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/config/:client/:version', async (req, res) => {
    try {
        const { client, version } = req.params;
        const { key } = req.body;
        const config = await configModel.findOneAndDelete({
            client: client,
            version: Number(version),
            key: key,
        });
        if (config) {
            res.status(204).send();
        } else {
            res.status(404).send({
                error: `Configs for ${client} version ${version} with key ${key} could not be found`,
            });
        }
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router