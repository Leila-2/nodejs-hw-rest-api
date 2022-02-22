const CreateError = require("http-errors");
const { Contact, schemas } = require('../../models/contact')
const mongoose = require('mongoose')


const updateById = async (req, res, next) => {
    try {
        const { error } = schemas.add.validate(req.body)
        if (error) {
            throw new CreateError(400, error.message)
        }
        const { contactId } = req.params
        const ownerId = req.user._id
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw new CreateError(400, "invalid ID")
        }
        const result = await Contact.findByIdAndUpdate({ _id: contactId, owner: ownerId }, req.body, { new: true })
        if (!result) {
            throw new CreateError(404, "Not found")
        }
        res.json(result)
    } catch (error) {
        next(error)
    }
}

module.exports = updateById