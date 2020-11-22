const mongoose = require('mongoose')

const configSchema = new mongoose.Schema(
	{
		client: {
			required: true,
			type: String,
		},
		version: {
			required: true,
			type: Number,
		},
		key: {
			required: true,
			type: String,			
            validate(value) {
                if (value.toLowerCase().match('version')) {
                    throw new Error('Word "version" cannot be used as key.')
                }
            }
		},
		value: {
			required: true,
			type: String,
		},
	},{versionKey:false}
);
configSchema.methods.toJSON = function () {
    const config = this
    const configObject = config.toObject()
    delete configObject._id
    return configObject
}

const configModel = mongoose.model(
	'Config',
	configSchema
);

module.exports = configModel;