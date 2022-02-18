
const { Router } = require('express')
const router = new Router()
const createError = require("http-errors");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, schemas } = require('../../models/user')
const { SECRET_KEY } = process.env


/// Signup
router.post('/users/signup', async (req, res, next) => {
    try {
        const { error } = schemas.signup.validate(req.body)
        if (error) {
            throw new createError(400, error.message)
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (user) {
            throw new createError(409, 'Email in use')
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const result = await User.create({ email, password: hashPassword })
        res.status(201).json({
            user: {
                email,
                subscription: "starter"
            }
        })
    } catch (error) {
        next(error)
    }
})

/// Login
router.post('/users/login', async (req, res, next) => {
    try {
        const { error } = schemas.signup.validate(req.body)
        if (error) {
            throw new createError(400, error.message)
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            throw new createError(401, "Email or password is wrong")
        }
        const compareResult = await bcrypt.compare(password, user.password)
        if (!compareResult) {
            throw new createError(401, "Email or password is wrong")
        }
        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, SECRET_KEY)
        await User.findByIdAndUpdate(user._id, { token })
        res.json({
            token: token,
            user: {
                email: email,
                subscription: "starter"
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router