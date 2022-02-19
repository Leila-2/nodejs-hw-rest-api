const CreateError = require("http-errors");
const { Contact } = require('../../models/contact')

const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        if (isNaN(page) || isNaN(limit)) {
            throw new CreateError(400, 'Params limit and page must be a number')
        }
        const skip = (page - 1) * limit;
        const { _id } = req.user
        const result = await Contact.find({ owner: _id }, '-createdAt', { skip, limit: +limit }).populate("owner")
        res.json(result)
    } catch (error) {
        next(error);
    }

}
module.exports = getAll
