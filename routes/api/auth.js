
const { Router } = require('express')
const router = new Router()
const СreateError = require("http-errors");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, schemas } = require('../../models/user')
const { SECRET_KEY } = process.env
const gravatar = require('gravatar')
const sendMail = require('../../helpers/sendMail')
const { v4 } = require('uuid')


/// Signup
router.post('/users/signup', async (req, res, next) => {
    try {
        const { error } = schemas.signup.validate(req.body)
        if (error) {
            throw new СreateError(400, error.message)
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (user) {
            throw new СreateError(409, 'Email in use')
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const avatarURL = gravatar.url(email)
        const verificationToken = v4()
        await User.create({ email, avatarURL, verificationToken, password: hashPassword })
        const mail = {
            to: email,
            subject: 'Подтверждение email',
            html: `<a target="_blank" href='http://localhost:3000/api/users/${verificationToken}'>Нажмите чтобы подтвердить email</a>`
        }
        await sendMail(mail);
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
            throw new СreateError(400, error.message)
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            throw new СreateError(401, "Email or password is wrong")
        }
        if (!user.verify) {
            throw new СreateError(401, "User not verify")
        }
        const compareResult = await bcrypt.compare(password, user.password)
        if (!compareResult) {
            throw new СreateError(401, "Email or password is wrong")
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