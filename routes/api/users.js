const authenticate = require('../../middlewares/authenticate')
const upload = require('../../middlewares/upload')
const { User, schemas } = require('../../models/user')

const { Router } = require('express')
const router = new Router()
const path = require('path')
const fs = require('fs/promises')
const CreateError = require('http-errors')
const sendMail = require('../../helpers/sendMail')


router.get("/verify/: verificationToken", async (req, res, next) => {
    try {
        const { verificationToken } = req.params
        const user = await User.findOne({ verificationToken })
        if (!user) {
            throw new CreateError(404, 'User not found')
        }
        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' })
        res.json({
            message: 'Verification successful'
        })
    } catch (error) {
        next(error)
    }
})

router.post('/verify', async (req, res, next) => {
    try {
        const { error } = schemas.verify.validate(req.body)
        if (error) {
            throw new CreateError(400, "missing required field email")
        }
        const { email } = req.body
        const user = await User.findOne({ email })
        if (user.verify) {
            throw new CreateError(400, "Verification has already been passed")
        }
        const mail = {
            to: email,
            subject: 'Подтверждение email',
            html: `<a target="_blank" href='http://localhost:3000/api/users/${user.verificationToken}'>Нажмите чтобы подтвердить email</a>`
        }
        await sendMail(mail);
        res.json({
            message: "Verification email sent"
        })
    } catch (error) {
        next(error)
    }
})

router.get('/current', authenticate, async (req, res, next) => {
    res.json({
        email: req.user.email,
        subscription: req.user.subscription
    })
})

router.get('/logout', authenticate, async (req, res) => {

    const { _id } = req.user
    await User.findByIdAndUpdate(_id, { token: null })
    console.log(req.headers.authorization)
    res.status(204).send()
})

const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars')

router.patch('/avatars', authenticate, upload.single('avatar'), async (req, res, next) => {
    const { path: tempUpload, filename } = req.file
    const { _id } = req.user
    try {
        const [extension] = filename.split('.').reverse()
        const newFileName = `${_id}.${extension}`
        const result = path.join(avatarsDir, newFileName)
        await fs.rename(tempUpload, result)
        const avatarURL = path.join(req.protocol, '://', req.get('host'), "public", "avatars", newFileName)

        await User.findByIdAndUpdate(_id, { avatarURL })
        res.json({
            avatarURL
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router