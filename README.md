# fancy-todo

## User Routes
### POST
1. POST /user/googleSignIn
* Route

        POST http://localhost:3000/user/googleSignIn

* Description

        Let user sign in using google sign-in

* Response (Status: 200)

        Returns token of logged in user
        {
            token:...
        }
        (If user is new, will create a new user in database)

* Reject (Status: 500)

        Internal server error

2. POST /user/signIn
* Route

        POST http://localhost:3000/user/signIn

* Description

        Let user sign in

* Response (Status: 200)

        Returns token of logged in user
        {
            token:...
        }

* Reject (Status: 400)

        Invalid email / password

* Reject (Status: 500)

        Internal server error

3. POST /user/register
* Route

        POST http://localhost:3000/user/register

* Description

        Create a new user in database

* Response (Status: 200)

        Object of created user
        {
            _id: ...,
            name: ...,
            email: ...,
            password: ...,
        }

* Reject (Status: 500)

        Internal server error

## Todo Routes
### GET
1. GET /todo
* Route  

        GET http://localhost:3000/todo
* Description

        Get todo list of currently logged in user (According to token)

* Response (Status 200)

        [
            { 
                _id: ...,
                name: ...,
                description: ...,
                status: ...,
                dueDate: ...,
                user: ...
            },
            .....
        ]

* Reject (Status: 500)

        Internal server error

### POST
1. POST /todo
* Route
        
        POST http://localhost:3000/todo

* Description

        Create a new todo for the currently logged in user

* Response (Status: 201)

        Object of currently created todo
        { 
            _id: ...,
            name: ...,
            description: ...,
            status: ...,
            dueDate: ...,
            user: ...
        }

* Reject (Status: 500)

        Internal server error
### PUT
1. PUT /todo/:id
* Route

        PUT http://localhost:3000/todo/:id

* Description

        Edit / update a todo list

* Response (Status: 200)

        Object of updated todo
        { 
            _id: ...,
            name: ...,
            description: ...,
            status: ...,
            dueDate: ...,
            user: ...
        }

* Reject (Status: 500)

        Internal server error

### DELETE
1. DELETE /todo/:id
* Route

        DELETE http://localhost:3000/todo/:id

* Description

        Delete a todo

* Response (Status: 200)

        Object of deleted todo
        { 
            _id: ...,
            name: ...,
            description: ...,
            status: ...,
            dueDate: ...,
            user: ...
        }

* Reject (Status: 500)

        Internal server error

## Quote Routes
### GET
1. GET /quote
* Route

        GET http://localhost:3000/quote

* Description

        Get a random inspirational quote

* Response (Status: 200)

        Returns a random quote
        {
            quoteText:...,
            quoteAuthor:...,
            senderName:...,
            senderLink:...,
            quoteLink:...
        }

* Reject (Status: 500)

        Internal server error
