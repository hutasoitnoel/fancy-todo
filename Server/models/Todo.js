const mongoose = require('mongoose')
const Schema = mongoose.Schema

let validDate = function (date) {
    if (new Date(date) > new Date() || String(new Date(date)).slice(0,10) == String(new Date()).slice(0,10)) return true
    else {
        return false
    }
}

let todoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please fill title of todo']
    },
    description: String,
    status: String,
    dueDate: {
        type: Date,
        validate: [{ validator: validDate, msg: "Please use a valid date: set date at least from this date" }]
    },
    user: { type: Schema.Types.ObjectId, ref: "User" }
})

todoSchema.pre('findOneAndUpdate', function (next){
    if(new Date(this._update.dueDate) > new Date() || String(new Date(this._update.dueDate)).slice(0,10) == String(new Date()).slice(0,10)){
        next()
    }else {
        throw new Error('Please use a valid date: set date at least from this date')
    }
})


todoSchema.pre('save', function (next) {
    this.status = 'Incomplete'
    next()
})

let Todo = new mongoose.model("Todo", todoSchema)

module.exports = Todo