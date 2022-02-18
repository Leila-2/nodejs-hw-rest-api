/* eslint-disable new-cap */


const mongoose = require('mongoose')
const { Router } = require('express')
const createError = require("http-errors");
const { Contact, schemas } = require('../../models/contact')
const authenticate = require('../../middlewares/authenticate')


const router = new Router()

// GET /api/contacts

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    if (isNaN(page) || isNaN(limit)) {
      throw new createError(400, 'Params limit and page must be a number')
    }
    const skip = (page - 1) * limit;
    const { _id } = req.user
    const result = await Contact.find({ owner: _id }, '-createdAt', { skip, limit: +limit }).populate("owner")
    res.json(result)
  } catch (error) {
    next(error);
  }

})

router.get('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const ownerId = req.user._id
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new createError(400, "invalid ID")
    }
    const result = await Contact.findById({ _id: contactId, owner: ownerId });

    if (!result) {
      throw new createError(404, "Not found");
    }
    res.json(result)
  }
  catch (error) {

    next(error)
  }
})

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body)
    if (error) {
      throw new createError(400, error.message)
    }
    const data = { ...req.body, owner: req.user._id }
    const result = await Contact.create(data)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const ownerId = req.user._id
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new createError(400, "invalid ID")
    }
    const result = await Contact.findByIdAndDelete({ _id: contactId, owner: ownerId })
    if (!result) {
      throw new createError(404, "Not found")
    }
    res.json({ message: "Contact deleted" })
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body)
    if (error) {
      throw new createError(400, error.message)
    }
    const { contactId } = req.params
    const ownerId = req.user._id
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new createError(400, "invalid ID")
    }
    const result = await Contact.findByIdAndUpdate({ _id: contactId, owner: ownerId }, req.body, { new: true })
    if (!result) {
      throw new createError(404, "Not found")
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.patch('/:contactId/favorite', authenticate, async (req, res, next) => {
  try {
    const { error } = schemas.update.validate(req.body)
    if (error) {
      throw new createError(400, "missing field favorite")
    }
    const { contactId } = req.params
    const ownerId = req.user._id
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw new createError(400, "invalid ID")
    }
    const result = await Contact.findByIdAndUpdate({ _id: contactId, owner: ownerId }, req.body, { new: true })
    if (!result) {
      throw new createError(404, "Not found")
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router
