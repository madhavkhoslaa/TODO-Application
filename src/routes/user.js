const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const userrouter = new express.Router()

userrouter.post('/users', async(req, res) => {
    /*This endpoint is used to accept a user */
    try {
        user = new User(req.body)
        const token = await user.getAuthtoken()
        console.log(user)
        await user.save()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

userrouter.get('/users/login', async(req, res) => {
    /*User login endpoint, accepts email ID and password */
    try {
        const user = await User.findbyCredentials(req.body.email, req.body.password)
        if (!user) {
            return res.status(400).send('unable to login')
        }
        const token = await user.getAuthtoken()
        res.status(200).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send("unable to login")
    }
})
userrouter.post('/users/logout', auth, async(req, res) => {
    /* User logout with JWT token that is stored locally*/
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token)
        await req.user.save()
        res.status(200).send({ message: "user logged out" })
    } catch (e) {
        res.status(500).send("internal server error")
    }
})

userrouter.get('/users/me', auth, async(req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send({ error: "not found" })
    }
})

userrouter.patch('/users/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const validkeys = ['name', 'email', 'password', 'age']
    const validrequest = updates.every((update) => validkeys.includes(update))
    if (!validrequest) return res.status(400).send({ error: "bad request" })
    try {
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await req.user.save()
        if (!user) return res.status(404).send({ error: `user with ${req.params.id} not found` })
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

userrouter.delete('/users/me', auth, async(req, res) => {
    const id_ = req.params.id
    try {
        req.user.delete()
        res.status(400).send({ message: "user deleted" })
    } catch (e) {
        res.status(500).send({ error: "internal server error" })
    }
})

module.exports = userrouter