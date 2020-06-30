const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (value.length > 20) throw new Error("name too long")
            if (value.length < 3) throw new Error("name too short")
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
        unique: true,
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
userSchema.methods.getAuthtoken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "password")
    return token
}
userSchema.statics.findbyCredentials = async(email, password, errorcallback) => {
    const user_ = await user.findOne({ "email": email })
    if (!user_) throw new Error('unable to login')
    const ismatched = await bcrypt.compare(password, user_.password)
    if (!ismatched) throw new Error('unable to login')
    return user_
}
userSchema.pre('save', function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, 8)
    }
    next()
})
user = mongoose.model('user', userSchema)

module.exports = user