const express = require('express')
const jwt = require('jsonwebtoken')
const User = require("../models/user")


const auth = async(req, res, next) => {
    try {
        const Authtoken = req.header("Authorization").replace("Bearer", "").trim()
        const decoded = jwt.verify(Authtoken, "password")
        const user_ = await User.find({ _id: decoded._id, 'tokens.token': Authtoken })
        req.user = user_[0]
        req.token = Authtoken
        next()
    } catch (e) {
        res.status(401).send({ error: "unable to authorize" })
    }
}

module.exports = auth