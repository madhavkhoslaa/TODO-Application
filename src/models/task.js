const mongoose = require('mongoose')

task = mongoose.model('task', {
    description: {
        type: String,
        required: true,
        maxlength: 300,
        minlength: 5,
    },
    completion: {
        type: Boolean,
        default: false,
        required: false
    }
})

module.exports = task