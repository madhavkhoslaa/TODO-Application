const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const taskrouter = new express.Router()


taskrouter.post('/task', auth, async(req, res) => {
    try {
        task = new Task({
            ...req.body,
            owner: req.user._id
        })
        const t = await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

taskrouter.get('/task', auth, async(req, res) => {
    try {
        const task = await Task.find({ owner: req.user._id })
        res.status(200).send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})

taskrouter.get('/task/:id', auth, async(req, res) => {
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        res.status(200).send(task)
    } catch (e) {
        res.status(404).send({ error: "not found" })
    }
})

taskrouter.patch('/task/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const validkeys = ['description', 'completion']
    const validrequest = updates.every((update) => validkeys.includes(update))
    if (!validrequest) return res.status(400).send({ error: "bad request" })
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        if (!task) return res.status(404).send({ error: "not found" })
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }
})

taskrouter.delete('/task/:id', auth, async(req, res) => {
    const id_ = req.params.id
    try {
        const task = await Task.deleteOne({ owner: req.user._id, _id: req.params.id })
        if (!task) return res.status(404).send({ error: `task with id: ${id_} not found` })
        res.status(400).send({ message: "task deleted", task })
    } catch (e) {
        res.status(500).send({ error: "internal server error" })
    }
})

module.exports = taskrouter