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
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
userSchema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.methods.getAuthtoken = async function() {
    const user_ = this
    const token = jwt.sign({ _id: user_._id.toString() }, "password")
    user_.tokens = user_.tokens.concat({ token })
    try {
        await user_.save()
    } catch (e) {
        console.log(e)
    }
    return token
}
userSchema.methods.toJSON = function() {
    const user_ = this
    const userobj_ = user_.toObject()
    delete userobj_.password
    delete userobj_.tokens
    return userobj_
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