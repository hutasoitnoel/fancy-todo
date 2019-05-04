const mongoose = require('mongoose')
const Schema = mongoose.Schema

let todoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please fill title of todo']
    },
    description: String,
    status: String,
    dueDate: Date,
    user: { type: Schema.Types.ObjectId, ref: "User" }
})

todoSchema.pre('save', function (next) {
    this.status = 'Incomplete'
    next()
})

let Todo = new mongoose.model("Todo", todoSchema)

module.exports = Todo