const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    department: {type: String, required: true},
    completed: {type: Boolean, required: true},
    dateCreation: {type: String, required: true},
    dateCompletion: {type: String},
    items: []
})

module.exports = model('Checklist', schema)