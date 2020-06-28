const express = require('express')
const User = require('../models/user')

const userrouter = new express.Router()

userrouter.post('/users', async(req, res) => {
    user = new User(req.body)
    try {
        await user.save()
        res.status(201).send({ message: "user created successfully" })
    } catch (e) {
        res.status(400).send(e)
    }
})

userrouter.get('/users/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send({ error: "not found" })
    }
})

userrouter.get('/users', async(req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send({ error: "not found" })
    }
})

userrouter.patch('/users/:id', async(req, res) => {
    const updates = Object.keys(req.body)
    const validkeys = ['name', 'email', 'password', 'age']
    const validrequest = updates.every((update) => validkeys.includes(update))
    if (!validrequest) return res.status(400).send({ error: "bad request" })
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) return res.status(404).send({ error: `user with ${req.params.id} not found` })
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

userrouter.delete('/users/:id', async(req, res) => {
    const id_ = req.params.id
    try {
        const user = await User.findByIdAndDelete(id_)
        if (!user) return res.status(404).send({ error: `user with id: ${id_} not found` })
        res.status(400).send({ message: "user deleted" })
    } catch (e) {
        res.status(500).send({ error: "internal server error" })
    }
})
module.exports = userrouter