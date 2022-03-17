const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')


const app = express()
app.use(cookieParser())

app.use(
    cors({
        credentials: true,
        origin: true
    })
)

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/checklist', require('./routes/checklist.routes'))
app.use('/api/users', require('./routes/user.routes'))

const PORT = config.get('port') || 5000

async function start() {
    try{
        await mongoose.connect(config.get('mongoUri'), {
        })
        app.listen(PORT, () => console.log(`App has benn started on port ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()