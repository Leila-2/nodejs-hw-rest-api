const { Schema, model } = require('mongoose')
const Joi = require("joi");


const contactSchema = Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },

    phone: {
        type: String,
        minlength: 12,
        required: true,
        unique: true
    },

    favorite: {
        type: Boolean,
        default: false
    },
    email: String
}, { versionKey: false });

const addJoiContactSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email(),
    favorite: Joi.boolean()
})
const updateJoiContactSchema = Joi.object({
    favorite: Joi.boolean().required()
})
const Contact = model('contact', contactSchema)

module.exports = {
    Contact,
    schemas: {
        add: addJoiContactSchema,
        update: updateJoiContactSchema
    }
}