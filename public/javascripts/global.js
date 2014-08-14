// Userlist data array for filling in info box
var userListData = [];

// DOM Ready ==========
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    $('#btnAddUser').on('click', addUser);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    $('#userList table tbody').on('click', 'td a.linkupdateuser', updateUser);
    $('#btnUpdateUser').on('click', updateUserTable);
    $('#btnCancelUpdate').on('click', togglePanels);
});

// Functions =====
//
// Fill table with data
function populateTable() {
    
    // Empty content string
    var tableContent = '';
    
    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {
        
        // Stick our user data array into a userlist variable in the global object
        userListData = data;
        var userBuffer = '';
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username +'</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) {
        return arrayItem.username;
    }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    // Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();
            }
            else {

                // If something goes wrong, alert the error message that our service return
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete user
function deleteUser(event) {
    
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function(response) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error :' + response.msg);
            }

            // Update the table
            populateTable();
        });
    }
    else {
        
        // If they said no to the confirm, do nothing
        return false;
    }
};

// Update usr
function updateUser(event) {
    event.preventDefault();
    
    // If the addUser panel is visible, hide it and show up
    if($('#addUserPanel').is(":visible")){
        togglePanels();
    }

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');
    userBuffer = thisUserName;

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) {
        return arrayItem._id;
    }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    $('#updateUser fieldset input#inputUserName').val(thisUserObject.username);
    $('#updateUser fieldset input#inputUserEmail').val(thisUserObject.email);
    $('#updateUser fieldset input#inputUserFullname').val(thisUserObject.fullname);
    $('#updateUser fieldset input#inputUserAge').val(thisUserObject.age);
    $('#updateUser fieldset input#inputUserLocation').val(thisUserObject.location);
    $('#updateUser fieldset input#inputUserGender').val(thisUserObject.gender);

};

// Update user table
function updateUserTable(event) {
    event.preventDefault();
    
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#updateUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#updateUser fieldset input#inputUserName').val(),
            'email': $('#updateUser fieldset input#inputUserEmail').val(),
            'fullname': $('#updateUser fieldset input#inputUserFullname').val(),
            'age': $('#updateUser fieldset input#inputUserAge').val(),
            'location': $('#updateUser fieldset input#inputUserLocation').val(),
            'gender': $('#updateUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: newUser,
            url: '/users/updateuser/' + userBuffer,
            dataType: 'JSON'
        }).done(function(response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
        //        $('#updateUser fieldset input').val('');
                togglePanels();
                // Update the table
                populateTable();
            }
            else {

                // If something goes wrong, alert the error message that our service return
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }

};

// Toggle addUser and updateUser panels
function togglePanels() {
    $('#addUserPanel').toggle();
    $('#updateUserPanel').toggle();
};
