const getAll = require('./contacts/getAll')
const getById = require('./contacts/getById')
const add = require('./contacts/add')
const removeById = require('./contacts/removeById')
const updateById = require('./contacts/updateById')
const updateStatus = require('./contacts/updateStatus')

module.exports = {
    getAll,
    getById,
    add,
    removeById,
    updateById,
    updateStatus
}