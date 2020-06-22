const mongoose = require('mongoose')
const validator = require('validator')

user = mongoose.model('user', {
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
        unique: true,
        maxlength: 20,
        validate(value) {
            if (value.length > 20) throw new Error("password too long")
            if (value.length < 3) throw new Error("password too short")
        }
    },
    age: {
        type: Number,
        required: false,
        min: 0,
        default: null,
        validate(value) {
            if (value < 0) throw new Error('age must be a positive number')
        }
    },
    email: {
        type: String,
        maxlength: 100,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("must be email");
        }
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 20,
        trim: true
    }
})

module.exports = user