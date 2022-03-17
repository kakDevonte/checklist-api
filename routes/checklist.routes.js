const {Router} = require('express')
const Checklist = require('../models/Checklist')
const router = Router()

router.post('/', async (req, res) => {

    try {
        const {name, department, completed, dateCreation, dateCompletion, items} = req.body.checklist

        const checklist = new Checklist({name, department, completed, dateCreation, dateCompletion, items})

        await checklist.save()

        res.status(201).json({resultCode: 0})

    } catch (e) {
        res.status(500).json({resultCode: 1})
    }
})
router.get('/', async (req, res) => {

    const checklists = await Checklist.find()

    res.json({resultCode: 0, data: {checklists}})

})

router.post('/department', async (req, res) => {

    const {department} = req.body

    const checklists = await Checklist.find({'department': department})

    res.json({resultCode: 0, data: {checklists}})

})

router.get('/head', async (req, res) => {
    const checklists = await Checklist.find({'completed': true})
    res.json({checklists: checklists})

})

router.put('/', async (req, res) => {

    const {_id, name, department, completed, dateCreation, dateCompletion, items} = req.body.checklist

    const checklist = {
        name,
        department,
        completed,
        dateCreation,
        dateCompletion,
        items
    }

    await Checklist.updateOne({'_id': _id}, checklist)

    res.status(201).json({message: 'Чеклист обнавлен'})
})

router.delete('/:id', async (req, res) => {

    const id = req.params.id

    await Checklist.deleteOne({'_id': id})

    res.status(201).json({resultCode: 0})
})

router.get('/:id', async (req, res) => {

    const id = req.params.id

    const checklist = await Checklist.findOne({'_id': id})

    res.status(201).json({resultCode: 0, data: checklist})
})

module.exports = router