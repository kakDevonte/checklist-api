const {Schema, model} = require('mongoose')

const schema = new Schema({
    token: {type: String, required: true},
    userId: {type: String, required: true}
})

module.exports = model('Token', schema)