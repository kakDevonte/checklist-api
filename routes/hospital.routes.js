const {Router} = require('express')
const Hospitalization = require('../models/Hospitalization')
const router = Router()


router.post('/get', async (req, res) => {
    const {date, department} = req.body
    const hospitalization = await Hospitalization.find({'department': department, 'date': date})
    res.json({resultCode: 0, hospitalization })
})

router.post('/getall', async (req, res) => {
    const {date} = req.body
    const hospitalization = await Hospitalization.find({'date': date})
    res.json({resultCode: 0, hospitalization })
})

router.post('/', async (req, res) => {
    try {
        const {date, department, patient} = req.body.data

        const object = await Hospitalization.findOne({'department': department, 'date': date})
        if(object === null){
            const hospitalization = new Hospitalization({date, department, patients: [patient]})
            await hospitalization.save()
        } else {
            object.patients.push(patient)
            await object.save()
        }
        res.status(201).json({resultCode: 0})
    } catch (e) {
        res.status(500).json({resultCode: 1, message: e.message})
    }
})

router.put('/', async (req, res) => {
    const {date, department, patients} = req.body.data
    const object = await Hospitalization.findOne({'department': department, 'date': date})

    const newHospital = {
        date,
        department,
        patients
    }
    await Hospitalization.updateOne({'_id': object._id}, newHospital)

    res.status(201).json({resultCode: 0})
})

router.post('/delete', async (req, res) => {
    const {date, department, patients} = req.body.data
    const object = await Hospitalization.findOne({'department': department, 'date': date})

    const newHospital = {
        date,
        department,
        patients
    }
    await Hospitalization.updateOne({'_id': object._id}, newHospital)

    res.status(201).json({resultCode: 0})
})

router.post('/search', async (req, res) => {
    const {patient} = req.body
    const hospitalization = await Hospitalization.find({patients: {$elemMatch: {name: new RegExp(patient, 'i')}}})
    res.json({resultCode: 0, hospitalization })
})

module.exports = router