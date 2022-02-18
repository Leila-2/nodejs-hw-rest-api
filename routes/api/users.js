const authenticate = require('../../middlewares/authenticate')
const { User } = require('../../models/user')

const { Router } = require('express')
const router = new Router()

router.get('/current', authenticate, async (req, res, next) => {
    res.json({
        email: req.user.email,
        subscription: req.user.subscription
    })
})

router.get('/logout', authenticate, async (req, res, next) => {

    const { _id } = req.user
    await User.findByIdAndUpdate(_id, { token: null })
    console.log(req.headers.authorization)
    res.status(204).send()


})

module.exports = router