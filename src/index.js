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
app.get('/task', (req, res) => {
    Task.find({}).then((task) => {
        res.status(200).send(task)
    }).catch((err) => {
        res.status(500).send(err)
    })
})
app.get('/task/:id', (req, res) => {
    Task.findById(req.params.id).then((task) => {
        res.status(200).send(task)
    }).catch((e) => {
        res.status(500).send(e)
    })
})
Task.findByIdAndDelete('5eefd52d3a6b732d179ffc1e').then((task) => {
    return Task.countDocuments({ completion: false })
}).then(number => console.log(number))
app.listen(port, () => console.log(`Server Running on ${port}`))