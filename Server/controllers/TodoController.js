const Todo = require('../models/Todo')
const ObjectId = require('../helpers/objectid')

class TodoController {
    static create(req, res) {
        const { name, description, status, dueDate} = req.body
        Todo.create({ name, description, status, dueDate, user: req.decoded._id })
            .then(todo => {
                res.status(200).json(todo)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static findOne(req, res) {
        Todo.findOne({ _id: ObjectId(req.params.id) })
            .populate('user')
            .then(todo => {
                res.status(200).json(todo)
            })
            .catch(err => {
                res.status(500).json(err)
            })

    }

    static findAll(req, res) {
        Todo.find()
            .populate('user')
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static findMine(req, res) {
        Todo.find({ user: ObjectId(req.decoded._id) })
            .populate('user')
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static update(req, res) {
        const {name, description, status, dueDate} = req.body
        Todo.findOneAndUpdate({ _id: req.params.id }, {
            name, description, status, dueDate
        }, { new: true })
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static delete(req, res) {
        Todo.findOneAndDelete({ _id: req.params.id })
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
}

module.exports = TodoController