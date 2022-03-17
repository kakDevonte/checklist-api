const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Token = require('../models/Token')
const router = Router()

router.post('/login',
    async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({ email })

            if (!user) {
                return  res.json({ resultCode: 1, message: 'Пользователь не найден' })
            }

            const isMath = await  bcrypt.compare(password, user.password)

            if (!isMath) {
                return  res.json({ resultCode: 1, message: 'Почта или пароль не верны' })
            }
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '2h' }
            )

            const tokenToDb = new Token ({ token, userId: user.id })
            await tokenToDb.save()

            res.cookie('token', token, {
                httpOnly: true
            })

            res.status(200).json({ resultCode: 0 })

        } catch (e) {
            res.json({ resultCode: 1, message: 'Что-то пошло не так, попробуйте снова'})
        }
})
//
router.get('/', async (req, res) => {

    const token = await Token.findOne({ token: req.cookies['token'] })

    if (!token) {
        return res.json({ resultCode: 1})
    }
    const user = await User.findOne({'_id': token.userId})
    if (!user) {
        return res.json({ resultCode: 1})
    }
    if (user.department)
        res.json({ resultCode: 0, data: {auth: true, role: user.role, department: user.department} })
    else
        res.json({ resultCode: 0, data: {auth: true, role: user.role, department: null} })
})

router.delete('/', async (req, res) => {

    const token = await Token.findOne(req.cookies)

    await Token.deleteOne(token)

    res.clearCookie('token')
    res.json({ resultCode: 0 })
})

module.exports = router