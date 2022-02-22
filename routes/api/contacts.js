const { Router } = require('express')
const router = new Router()

const authenticate = require('../../middlewares/authenticate')
const ctrl = require('../../controllers/index')


// GET /api/contacts
router.get('/', authenticate, ctrl.getAll)

router.get('/:contactId', authenticate, ctrl.getById)

// POST /api/contacts
router.post('/', authenticate, ctrl.add)

// DELETE /api/contacts
router.delete('/:contactId', authenticate, ctrl.removeById)

// PUT /api/contacts
router.put('/:contactId', authenticate, ctrl.updateById)

// PATCH /api/contacts
router.patch('/:contactId/favorite', authenticate, ctrl.updateStatus)

module.exports = router
