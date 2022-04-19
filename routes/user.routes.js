const {Router} = require('express')
const User = require('../models/User')
const Token = require('../models/Token')
const bcrypt = require("bcryptjs");
const Checklist = require('../models/Checklist')
const nodemailer = require('nodemailer')
const config = require('config')
const {isEmpty} = require('validator')
const {check, validationResult} = require("express-validator");
const router = Router()


// /api/user/

router.post('/', async (req, res) => {
    try {
        const {email, firstName, lastName, password, role, department} = req.body.user
        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: 'Такой пользователь уже существует'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({email, firstName, lastName, password: hashedPassword, role, department})

        await user.save()

        res.status(201).json({ resultCode: 0 })

    } catch (e) {
        res.status(500).json({ resultCode: 1 })
    }
})


router.get('/', async (req, res) => {

    try {
        const users = await User.find()
        res.json({ resultCode: 0, data: users })
    } catch (error) {
        res.status(500).json({ resultCode: 1 })
    }
})

router.get('/:id', async (req, res) => {

    const id = req.params.id

    const user = await User.findOne({ '_id': id })

    res.status(201).json({ resultCode: 0, user })
})

router.put('/', async (req, res) => {

    try {
        const {email, firstName, lastName, password, role, department} = req.body.user
        if (isEmpty(password)) {
            const user = {email, firstName, lastName, role, department}
            await User.updateOne({'_id': req.body.user._id}, user)
        } else {
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = {email, firstName, lastName, password: hashedPassword, role, department}
            await User.updateOne({'_id': req.body.user._id}, user)
        }
        res.status(201).json({resultCode: 0})
    } catch (error) {
        res.status(500).json({ resultCode: 1 })
    }
})

router.delete('/:id', async (req, res) => {

    const id = req.params.id

    await User.deleteOne({'_id': id})

    res.status(201).json({ resultCode: 0 })
})

router.post('/mail', async (req, res) => {
    const {department, subject, checklist} = req.body
    let letter = null

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.get('emailUser'),
            pass: config.get('emailPass')
        }
    })

    if (subject == 'create') {
        const users = await User.find()
        const result = users.filter(user => user.role == 'user' && user.department == department)
        const strResult = result.map(user => user.email).join(', ')
        console.log(result)
        console.log(strResult)
        letter = {
            from: `<${config.get('email')}>`,
            to: strResult,
            subject: 'Создан новый чеклист',
            text: `Создан новый чеклист "${checklist}", зайдите на сайт для заполнения.`,
        }

    }
    if (subject == 'completed') {
        const users = await User.find()
        const result = users.filter(user => user.role == 'head')
        const strResult = result.map(user => user.email).join(', ')

        console.log(result)
        console.log(strResult)

        letter = {
            from: `<${config.get('email')}>`,
            to: strResult,
            subject: `Чеклист ${checklist} заполнен`,
            text: `Чеклист "${checklist}" заполнен, зайдите на сайт для проверки.`,
        }
    }

    await transporter.sendMail(letter, function (error, response) {
        if (error) {
            res.status(201).json({message: error})
        }
        transporter.close()
    })
})

module.exports = router