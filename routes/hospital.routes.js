const {Router} = require('express')
const Hospitalization = require('../models/Hospitalization')
const Log = require('../models/Log')
const router = Router()


router.post('/get', async (req, res) => {
    try {
        const {firstDate, secondDate, department} = req.body

        let now = new Date(secondDate);
        let hospitalArray = []
        if (secondDate.length > 0) {
            for (let d = new Date(firstDate); d <= now; d.setDate(d.getDate() + 1)) {
                const hospitalization = await Hospitalization.findOne({
                    'department': department,
                    'date': d.toLocaleDateString('en-CA')
                })
                if (hospitalization) {
                    hospitalization.patients = hospitalization.patients.sort(function (x, y) {
                        return (x.isDelete === y.isDelete) ? 0 : x.isDelete ? 1 : -1;
                    })
                    hospitalArray.push(hospitalization)
                }
            }
        } else {
            const hospitalization = await Hospitalization.findOne({
                'department': department,
                'date': firstDate
            })
            if (hospitalization) {
                hospitalization.patients = hospitalization.patients.sort(function (x, y) {
                    return (x.isDelete === y.isDelete) ? 0 : x.isDelete ? 1 : -1;
                })
                hospitalArray.push(hospitalization)
            }
        }

        res.status(201).json(hospitalArray)
    }
    catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.post('/getall', async (req, res) => {
   try {
       const {firstDate, secondDate} = req.body

       let now = new Date(secondDate);
       let hospitalArray = []
       if (secondDate.length > 0) {
           for (let d = new Date(firstDate); d <= now; d.setDate(d.getDate() + 1)) {
               const hospitalization = await Hospitalization.find({
                   'date': d.toLocaleDateString('en-CA')
               })
               if (hospitalization) {
                   hospitalization.forEach(item => {
                       item.patients = item.patients.sort(function (x, y) {
                           return (x.isDelete === y.isDelete) ? 0 : x.isDelete ? 1 : -1;
                       })
                   })
                   hospitalArray.push(...hospitalization)
               }
           }
       } else {
           const hospitalization = await Hospitalization.find({
               'date': firstDate
           })
           if (hospitalization) {
               hospitalization.forEach(item => {
                   item.patients = item.patients.sort(function (x, y) {
                       return (x.isDelete === y.isDelete) ? 0 : x.isDelete ? 1 : -1;
                   })
               })
               hospitalArray.push(...hospitalization)
           }
       }
       res.status(201).json(hospitalArray)
   }
   catch (e) {
       res.status(500).json({message: e.message})
   }
})

router.post('/', async (req, res) => {
    try {
        const {date, department } = req.body

        const patient = {
            id: req.body.id,
            name: req.body.name,
            content: req.body.content,
            direction: req.body.direction,
            comment: req.body.comment,
            declarer: req.body.declarer,
            isPermit: req.body.isPermit,
            isDelete: req.body.isDelete
        }

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
        res.status(500).json({message: e.message})
    }
})

router.put('/', async (req, res) => {
   try {
       const {date, department} = req.body

       const patient = {
           id: req.body.id,
           name: req.body.name,
           content: req.body.content,
           direction: req.body.direction,
           comment: req.body.comment,
           declarer: req.body.declarer,
           isPermit: req.body.isPermit,
           isDelete: req.body.isDelete
       }

       const object = await Hospitalization.findOne({'department': department, 'date': date})

       object.patients = object.patients.map(item => item.id === req.body.id ? patient : item)

       await object.save();

       res.status(201).json({resultCode: 0})
   }
   catch (e) {
       res.status(500).json({message: e.message})
   }
})

router.put('/delete', async (req, res) => {
    try {
        const {date, department, id, isDelete} = req.body

        const object = await Hospitalization.findOne({'department': department, 'date': date})

        const newObjectPatients = object.patients.map((item) => (
            item.id === id
                ? {...item, isDelete: isDelete}
                : item
        ));

        object.patients = newObjectPatients

        await object.save();

        res.status(201).json({resultCode: 0})
    }
    catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.post('/delete', async (req, res) => {
    try {
        const {date, department, id} = req.body
        const object = await Hospitalization.findOne({'department': department, 'date': date})
        object.patients = object.patients.filter((item) => {return item.id != id})

        await object.save();

        res.status(201).json({resultCode: 0})
    }
    catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.post('/log', async (req, res) => {
    try {
        const {date, message} = req.body

        const log = new Log({date,message})
        await log.save()

        res.status(201).json({resultCode: 0})
    }
    catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.get('/getlogs', async (req, res) => {

    try {
        const logs = await Log.find()
        res.json(logs)
    } catch (error) {
        res.status(500).json({ resultCode: 1 })
    }
})

module.exports = router