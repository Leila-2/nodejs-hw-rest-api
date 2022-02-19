const authenticate = require('../../middlewares/authenticate')
const upload = require('../../middlewares/upload')
const { User } = require('../../models/user')

const { Router } = require('express')
const router = new Router()
const path = require('path')
const fs = require('fs/promises')

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
        const avatarURL = path.join('avatars', newFileName)
        await User.findByIdAndUpdate(_id, { avatarURL })
        res.json({
            avatarURL
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router