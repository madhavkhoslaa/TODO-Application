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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
})

module.exports = task