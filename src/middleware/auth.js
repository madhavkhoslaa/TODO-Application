const express = require('express')
const jwt = require('jsonwebtoken')
const User = require("../models/user")


const auth = async(req, res, next) => {
    try {
        const Authtoken = req.header("Authorization").replace("Bearer", "").trim()
        const decoded = jwt.verify(Authtoken, "password")
        const user_ = User.findOne({ _id: decoded._id, 'tokens.token': Authtoken }, { lean: true })
        if (!user_) throw new Error()
        req.user = user_._doc
        console.log(user_)
        next()
    } catch (e) {
        console.log(e)
        res.status(200).send("unable to authorize")
    }

}

module.exports = auth