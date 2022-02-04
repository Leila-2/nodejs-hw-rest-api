/* eslint-disable new-cap */

const express = require('express')
const createError = require("http-errors");
const { Contact, schemas } = require('../../models/contact')


const router = express.Router()

// GET /api/contacts

router.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find()
    res.json(result)
  } catch (error) {
    next(error);
  }

})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      // eslint-disable-next-line new-cap
      throw new createError(404, "Not found");
    }
    res.json(result)
  }
  catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404
    }
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body)
    if (error) {
      throw new createError(400, error.message)
    }

    const result = await Contact.create(req.body)
    res.status(201).json(result)
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId)
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
    const { error } = schemas.add.validate(req.body)
    if (error) {
      throw new createError(400, error.message)
    }
    const { contactId } = req.params

    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true })
    if (!result) {
      throw new createError(404, "Not found")
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { error } = schemas.update.validate(req.body)
    if (error) {
      throw new createError(400, "missing field favorite")
    }
    const { contactId } = req.params

    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true })
    if (!result) {
      throw new createError(404, "Not found")
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router
