const express = require('express')
const User = require('./models/user')
const Task = require('./models/task')
require('./db/mongoose')
const port = process.env.port || 3002

const app = express()
app.use(express.json())

app.post('/users', async(req, res) => {
    user = new User(req.body)
    try {
        await user.save()
        res.status(201).send({ message: "user created successfully" })
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/users/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send({ error: "not found" })
    }
})

app.get('/users', async(req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send({ error: "not found" })
    }
})

app.patch('/users/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const validkeys = ['name', 'email', 'password', 'age']
    const validrequest = updates.every((update) => validkeys.includes(update))
    if (!validrequest) return res.status(400).send({ error: "bad request" })
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (Object.keys(user).length === 0) return res.status(404).send({ error: "not found" })
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.post('/task', async(req, res) => {
    try {
        task = new Task(req.body)
        const t = await task.save()
        res.status(201).send({ message: "task created successfully" })
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/task', async(req, res) => {
    try {
        const task = await Task.find({})
        res.status(200).send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

app.get('/task/:id', async(req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        res.status(200).send(task)
    } catch (e) {
        res.status(404).send({ error: "not found" })
    }
})

app.patch('/task/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const validkeys = ['description', 'completion']
    const validrequest = updates.every((update) => validkeys.includes(update))
    if (!validrequest) return res.status(400).send({ error: "bad request" })
    try {
        const user = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (Object.keys(user).length === 0) return res.status(404).send({ error: "not found" })
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(port, () => console.log(`Server Running on ${port}`))