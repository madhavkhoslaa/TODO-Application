const express = require('express')
const jwt = require('jsonwebtoken')
const User = require("../models/user")


const auth = async(req, res, next) => {
    try {
        console.log("middle ware")
        next()
    } catch (e) {
        console.log(e)
    }

}

module.exports = auth