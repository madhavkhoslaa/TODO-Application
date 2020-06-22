const express = require('express')
const User = require('./models/user')
const Task = require('./models/task')
require('./db/mongoose')
const port = process.env.port || 3002

const app = express()
app.use(express.json())

app.post('/users', (req, res) => {
    user = new User(req.body)
    user.save().then(() => {
        res.status(201).send({ message: "user created successfully" })
    }).catch((e) => {
        res.status(400).send(e)
    })
})
app.post('/task', (req, res) => {
    task = new Task(req.body)
    task.save().then(() => {
        res.status(201).send({ message: "task created successfully" })
    }).catch((e) => {
        res.status(400).send(e)
    })
})
app.listen(port, () => console.log(`Server Running on ${port}`))