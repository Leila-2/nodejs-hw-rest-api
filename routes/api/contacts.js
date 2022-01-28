/* eslint-disable new-cap */
const express = require('express')
const createError = require("http-errors");
const contacts = require('../../models/contacts')

const Joi = require("joi");

const contsctSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email()
});

const router = express.Router()
// GET /api/contacts
router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts()
    res.json(result)
  } catch (error) {
    next(error);
  }

})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.getContactById(id)
    if (!result) {
      // eslint-disable-next-line new-cap
      throw new createError(404, "Not found");
    }
    res.json(result)
  }
  catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contsctSchema.validate(req.body)
    if (error) {
      // eslint-disable-next-line new-cap
      throw new createError(400, error.message)
    }
    const { name, email, phone } = req.body
    const result = await contacts.addContact(name, email, phone)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId)
    if (!result) {
      throw new createError(404, "Not found")
    }
    res.json({ message: "Contact deleted" })
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contsctSchema.validate(req.body)
    if (error) {
      throw new createError(400, error.message)
    }
    const { contactId } = req.params
    const { name, email, phone } = req.body
    const result = await contacts.updateContact(contactId, name, email, phone)
    if (!result) {
      throw new createError(404, "Not found")
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router
