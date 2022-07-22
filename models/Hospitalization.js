const {Schema, model} = require('mongoose')

const schema = new Schema({
    date: {type: String, required: true},
    department: {type: String, required: true},
    patients: []
})

module.exports = model('Hospitalization', schema)