const express = require('express')
const Task = require('../models/task')

const taskrouter = new express.Router()


taskrouter.post('/task', async(req, res) => {
    try {
        task = new Task(req.body)
        const t = await task.save()
        res.status(201).send({ message: "task created successfully" })
    } catch (e) {
        res.status(400).send(e)
    }
})

taskrouter.get('/task', async(req, res) => {
    try {
        const task = await Task.find({})
        res.status(200).send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

taskrouter.get('/task/:id', async(req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        res.status(200).send(task)
    } catch (e) {
        res.status(404).send({ error: "not found" })
    }
})

taskrouter.patch('/task/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const validkeys = ['description', 'completion']
    const validrequest = updates.every((update) => validkeys.includes(update))
    if (!validrequest) return res.status(400).send({ error: "bad request" })
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) return res.status(404).send({ error: "not found" })
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

taskrouter.delete('/task/:id', async(req, res) => {
    const id_ = req.params.id
    try {
        const task = await Task.findByIdAndDelete(id_)
        if (!task) return res.status(404).send({ error: `task with id: ${id_} not found` })
        res.status(400).send({ message: "task deleted" })
    } catch (e) {
        res.status(500).send({ error: "internal server error" })
    }
})

module.exports = taskrouter