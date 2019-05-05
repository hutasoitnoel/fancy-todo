const Todo = require('../models/Todo')
const ObjectId = require('../helpers/objectid')
const nodemailer = require('nodemailer')

class TodoController {
    static create(req, res) {
        const { name, description, status, dueDate, sendEmail } = req.body
        Todo
            .create({ name, description, status, dueDate, user: req.decoded._id })
            .then(todo => {
                if (sendEmail) {
                    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                    const email = `
                    <h1> Hi ${name}! </h1>
                    <h3>This message is from Evertodo! We are to inform that you have added a new todo list with the following description:</h3>
                    <h4> Title: </h4> 
                    <p>${name}</p>
                    <h4> Description: </h4>
                    <p> ${description}</p>
                    <h4> Due Date: </h4>
                    <p>${day[new Date(dueDate).getMonth()]}, ${new Date(dueDate).getDate()} ${month[new Date(dueDate).getMonth()]} ${new Date(dueDate).getFullYear()}</p>
                    <h3> Thanks for using Evertodo! Have a great day :)<h3>
                    <h3 style="font-style: italic">"The most effective way to do it, is to do it"<h3>
                    <h3>- Amelia Earhart<h3>
                    `
                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: 'evertodooo@gmail.com',
                            pass: 'ever271296'
                        },
                        tls: { rejectUnauthorized: false }
                    });

                    let mailOptions = {
                        from: '"Evertodo" <evertodooo@gmail.com>',
                        to: `${req.decoded.email}`,
                        subject: "You added a new todo!",
                        text: 'Hello world!',
                        html: email
                    }

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) return console.log(error)
                        console.log(`message sent`, info.messageId);
                    })
                } else {
                    console.log(`dont send email!`);
                }
                res.status(201).json(todo)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static findOne(req, res) {
        Todo
            .findOne({ _id: ObjectId(req.params.id) })
            .populate('user')
            .then(todo => {
                res.status(200).json(todo)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static findAll(req, res) {
        Todo
            .find()
            .populate('user')
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static findMine(req, res) {
        Todo
            .find({ user: ObjectId(req.decoded._id) })
            .populate('user')
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static update(req, res) {
        console.log(req.body);
        
        const { name, description, status, dueDate } = req.body
        Todo
            .findOneAndUpdate({ _id: req.params.id }, {
                name, description, status, dueDate
            }, { new: true })
            .then(updated => {
                console.log(`berhasil update`);
                
                res.status(200).json(updated)
            })
            .catch(err => {
                console.log('masuk error');
                console.log(err.message);
                console.log(err);
                
                res.status(500).json(err.message)
            })
    }

    static delete(req, res) {
        Todo
            .findOneAndDelete({ _id: req.params.id })
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }
}

module.exports = TodoController