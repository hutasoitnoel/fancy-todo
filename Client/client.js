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
            console.log(response);
            localStorage.setItem('token', response.token)
        })
        .fail((jqXHR, textStatus) => {
            $('#notification').text(jqXHR.responseJSON.msg).show();
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
            $('#notification').hide()
            if (response.token) {
                localStorage.token = response.token
                $('#googleSignIn').hide()
                $('#googleSignOut').show()
                $('#loginRegisterForm').hide()
                $('#myTodos').show()
                $('#addTodo').show()
            }
        })
        .fail((jqXHR, textStatus) => {
            $('#notification').text(jqXHR.responseJSON.msg).show();
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
            $('#notification').removeClass("alert-danger")
            $('#notification').addClass("alert-success")
            $('#notification').text(`${response.name} successfully registered! Welcome to Evertodo :)`).show();
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
    $('#myTodos').hide()
    $('#addTodo').hide()
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
                // Kalo user tulis description pakai enter, saat dibaca client akan jadi spasi
                // kalo didiemin \n jadi error
                el.description = el.description.split('\n').join(' ');

                const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                console.log(el.status);
                console.log(el.status == 'Incomplete');
                
                if (el.status == 'Incomplete'){
                    $('#tbody').append(`
                        <tr class="table-danger">
                        <td>${el.name}</td>
                        <td style="max-width: 14px;overflow: hidden;text-overflow: ellipsis;">${el.description}</td>
                        <td>${el.status}</td>
                        <td>${day[new Date(el.dueDate).getMonth()]}, ${new Date(el.dueDate).getDate()} ${month[new Date(el.dueDate).getMonth()]} ${new Date(el.dueDate).getFullYear()}</td>
                        <td><a 
                        href="#";
                        onclick="showEditForm('${el._id}', '${el.name}', '${el.description}', '${el.status}','${el.dueDate}');
                        $('#table').hide(); 
                        $('#editFormContainer').show()";>
                        Edit </a> 
                        || 
                        <a href="#" onclick="deleteTodo('${el._id}')"> Delete </a>
                        </td>
                        </tr>
                    `)
                }else {
                    $('#tbody').append(`
                        <tr class="table-success">
                        <td>${el.name}</td>
                        <td style="max-width: 14px;overflow: hidden;text-overflow: ellipsis;">${el.description}</td>
                        <td>${el.status}</td>
                        <td>${day[new Date(el.dueDate).getMonth()]}, ${new Date(el.dueDate).getDate()} ${month[new Date(el.dueDate).getMonth()]} ${new Date(el.dueDate).getFullYear()}</td>
                        <td><a 
                        href="#";
                        onclick="showEditForm('${el._id}', '${el.name}', '${el.description}', '${el.status}','${el.dueDate}');
                        $('#table').hide(); 
                        $('#editFormContainer').show()";>
                        Edit </a> 
                        || 
                        <a href="#" onclick="deleteTodo('${el._id}')"> Delete </a>
                        </td>
                        </tr>
                    `)
                }
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
    console.log(todoId);
    console.log(name);
    console.log(description);
    console.log(status);
    console.log(dueDate);
    
    
    
    
    
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
            dueDate: $('#add-date').val(),
            sendEmail: $("input[name='sendEmail']:checked").val()
        }
    })
        .done(response => {
            $('#addFormContainer').hide()
            myTodo()
        })
        .fail((jqXHR, textStatus) => {
            console.log(jqXHR);
            
            $('#notification').text(jqXHR.responseJSON.errors.dueDate.message).show()
        })

}

function editTodo(todoToEdit) {
    console.log($('#edit-name').val())
    console.log($('#edit-description').val())
    console.log($('#edit-status').val())
    console.log($('#edit-dueDate').val())
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
            console.log(`edit berhasil`);
            
            console.log(response);

        })
        .fail((jqXHR, textStatus) => {
            $('#notification').text(jqXHR.responseJSON).show()
        })
}

$(document).ready(() => {

    $('#addFormContainer').hide()
    $('#editFormContainer').hide()
    $('#notification').hide()
    if (localStorage.token) {
        $('#loginRegisterForm').hide()
        $('#googleSignIn').hide()
        $('#googleSignOut').show()
    } else if (!localStorage.token) {
        $('#loginRegisterForm').show()
        $('#myTodos').hide()
        $('#addTodo').hide()
        $('#googleSignIn').show()
        $('#googleSignOut').hide()
    }
    $('#signInForm').on('submit', event => {
        event.preventDefault()
        signIn()
    })
    $('#registerForm').on('submit', event => {
        event.preventDefault()
        $('#notification').hide()
        register()
    })
    $('#addForm').on('submit', event => {
        event.preventDefault()
        $('#notification').hide()

        addTodo()
    })
    $('#editForm').on('submit', event => {
        event.preventDefault()
        $('#notification').hide()

        editTodo(todoToEdit)
        $('#editFormContainer').hide()
        myTodo()
    })
    $('#myTodos').on('click', event => {
        myTodo()
        $('#notification').hide()

        $('#editFormContainer').hide()
        $('#addFormContainer').hide()
        $('#loginRegisterForm').hide()
    })
    $('#addTodo').on('click', event => {
        $('#notification').hide()

        $('#addFormContainer').show()
        $('#table').hide()
        $('#loginRegisterForm').hide()
    })
})