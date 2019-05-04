// Notes:
// onSignIn => Google Sign
// signIn => Regular sign in

// Google sign in
function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: "http://localhost:3000/user/googleSignIn",
        method: "POST",
        headers: {
            access_token: id_token
        }
    })
        .done(response => {
            localStorage.setItem('token', response.token)
        })
        .fail((jqXHR, textStatus) => {
            console.log(`error google sign in`);
        })
    $('#googleSignIn').hide()
    $('#googleSignOut').show()
    $('#loginRegisterForm').hide()

}

// Regular sign in
function signIn() {
    $.ajax({
        url: "http://localhost:3000/user/signIn",
        method: "POST",
        data: {
            email: $('#signIn-email').val(),
            password: $('#signIn-password').val()
        }
    })
        .done(response => {
            $('#wrongInput').hide()
            if (response.token) {
                localStorage.token = response.token
                $('#googleSignIn').hide()
                $('#googleSignOut').show()
                $('#loginRegisterForm').hide()
            }
        })
        .fail((jqXHR, textStatus) => {
            $('#wrongInput').text(jqXHR.responseJSON.msg).show();
        })

}

function register() {
    $.ajax({
        url: "http://localhost:3000/user/register",
        method: "POST",
        data: {
            name: $('#register-name').val(),
            email: $('#register-email').val(),
            password: $('#register-password').val()
        }
    })
        .done(response => {
            $('#signupbox').hide()
            $('#loginbox').show()
        })
        .fail((jqXHR, textStatus) => {
            console.log(`error register`);
        })
}

function signOut() {
    localStorage.removeItem('token')
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    $('#googleSignIn').show()
    $('#googleSignOut').hide()
    $('#loginRegisterForm').show()
    $('#thead > tr').remove()
    $('#tbody > tr').remove()
    $('#addFormContainer').hide()

}

function myTodo() {
    $.ajax({
        url: 'http://localhost:3000/todo',
        method: "GET",
        headers: {
            token: localStorage.token
        }
    })
        .done(response => {
            $('#thead > tr').remove()
            $('#tbody > tr').remove()
            $('#thead').append(`
            <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
            </tr>
            `)

            response.forEach((el, i) => {
                $('#tbody').append(`
                    <tr>
                    <td>${el.name}</td>
                    <td>${el.description}</td>
                    <td>${el.status}</td>
                    <td>${el.dueDate}</td>
                    <td><a href="#" onClick="showEditForm('${el._id}', '${el.name}', '${el.description}', '${el.status}','${el.dueDate}'); $('#table').hide(); $('#editFormContainer').show()";>Edit</a> || 
                    <a href="#" onclick="deleteTodo('${el._id}')">Delete</a>
                    </td>
                    </tr>
                `)
            });
            $('#table').show()
        })
        .fail((jqXHR, textStatus) => {
            console.log(`error get my todo list`);
            
        })
}

// untuk dipakai pada function editToDo
var todoToEdit = '';
function showEditForm(todoId, name, description, status, dueDate) {
    $('#edit-name').val(name)
    $('#edit-description').val(description)
    $('#edit-status').val(status)
    $('#edit-dueDate').val(dueDate.slice(0, 10))
    todoToEdit = todoId
}

function deleteTodo(todoId) {
    $.ajax({
        url: `http://localhost:3000/todo/${todoId}`,
        method: "DELETE",
        headers: {
            token: localStorage.token
        }
    })
        .done(response => {
            $('#thead > tr').remove()
            $('#tbody > tr').remove()
            myTodo()
        })
        .fail((jqXHR, textStatus) => {
            console.log(textStatus);

        })
}

function addTodo() {
    $.ajax({
        url: "http://localhost:3000/todo",
        method: "POST",
        headers: {
            token: localStorage.token
        },
        data: {
            name: $('#add-name').val(),
            description: $('#add-description').val(),
            dueDate: $('#add-date').val()
        }
    })
        .done(response => {
            $('#addFormContainer').hide()
            myTodo()
        })
        .fail((jqXHR, textStatus) => {
            $('#wrongInput').text(jqXHR.responseJSON.errors.name.message).show()
        })

}

function editTodo(todoToEdit) {
    $.ajax({
        url: `http://localhost:3000/todo/${todoToEdit}`,
        method: "PATCH",
        headers: {
            token: localStorage.token
        },
        data: {
            name: $('#edit-name').val(),
            description: $('#edit-description').val(),
            status: $('#edit-status').val(),
            dueDate: $('#edit-dueDate').val()
        }
    })
        .done(response => {
            console.log(response);

        })
        .fail((jqXHR, textStatus) => {
            console.log(jqXHR.responseJSON.msg);
        })
}

$(document).ready(() => {
    $('#addFormContainer').hide()
    $('#editFormContainer').hide()
    $('#wrongInput').hide()
    if (localStorage.token) {
        $('#googleSignIn').hide()
        $('#googleSignOut').show()
    } else if (!localStorage.token) {
        $('#googleSignIn').show()
        $('#googleSignOut').hide()
    }
    $('#signInForm').on('submit', event => {
        event.preventDefault()
        signIn()
    })
    $('#registerForm').on('submit', event => {
        event.preventDefault()
        $('#wrongInput').hide()
        register()
    })
    $('#addForm').on('submit', event => {
        event.preventDefault()
        $('#wrongInput').hide()

        addTodo()
    })
    $('#editForm').on('submit', event => {
        event.preventDefault()
        $('#wrongInput').hide()

        editTodo(todoToEdit)
        $('#editFormContainer').hide()
        myTodo()
    })
    $('#myTodos').on('click', event => {
        myTodo()
        $('#wrongInput').hide()

        $('#editFormContainer').hide()
        $('#addFormContainer').hide()
        $('#loginRegisterForm').hide()
    })
    $('#addTodo').on('click', event => {
        $('#wrongInput').hide()

        $('#addFormContainer').show()
        $('#table').hide()
        $('#loginRegisterForm').hide()
    })
})