const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcryptjs = require('../helpers/bcryptjs')

let validEmail = function (email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

let uniqueEmail = function (email) {
    return User.findOne({ email: email })
        .then(user => {
            if (user) return false
            else return true
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        validate:
            [{ validator: validEmail, msg: 'Please use a valid email address' },
            { validator: uniqueEmail, msg: "Email address is already taken" }]
    },
    password: String
})

userSchema.pre('save', function (next) {
    const hash = bcryptjs.hashSync(this.password, 8)
    this.password = hash
    next()
})

const User = new mongoose.model("User", userSchema)

module.exports = User