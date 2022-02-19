const CreateError = require("http-errors");
const { Contact } = require('../../models/contact')
const mongoose = require('mongoose')

const removeById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const ownerId = req.user._id
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            throw new CreateError(400, "invalid ID")
        }
        const result = await Contact.findByIdAndDelete({ _id: contactId, owner: ownerId })
        if (!result) {
            throw new CreateError(404, "Not found")
        }
        res.json({ message: "Contact deleted" })
    } catch (error) {
        next(error);
    }
}

module.exports = removeById