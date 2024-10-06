const urlBase = 'http://n8banks.xyz/API';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin(event){
    event.preventDefault();
    //console.log("doLogin working"); // Check if function is being called
    userId = 0;
    firstName = "";
    lastName = "";
    
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    // var hash = md5( password );
    
    document.getElementById("loginResult").innerHTML = "";
    if (login === "" || password === "") {
        document.getElementById("loginResult").innerHTML = "Please enter both login and password.";
        return;
    }
    let tmp = {login:login,password:password};
    // var tmp = {login:login,password:hash};

    let jsonPayload = JSON.stringify( tmp );
    let url = urlBase + '/Login.' + extension;
    console.log("doLogin still working"); // Check if function is being called
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse( xhr.responseText );
                userId = jsonObject.id;
                localStorage.setItem("userId", userId);

                if( userId < 1 )
                {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                window.location.href = "option_menu.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

function addUser(event)
{
    event.preventDefault();
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let login = document.getElementById("login").value;
    let password = document.getElementById("password").value;

    document.getElementById("userAddResult").innerHTML = "";

    let tmp = {firstname:firstName,lastname:lastName, login:login, password:password};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/AddUser.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                console.log("function triggered"); // Check if function is being called
                document.getElementById("userAddResult").innerHTML = "User has been added";
                window.location.href = "main_page.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("userAddResult").innerHTML = err.message;
    }

}

function addContact() {
    event.preventDefault();
    // Get contact details from input fields
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let userId = localStorage.getItem("userId");
    // Clear any previous result messages
    document.getElementById("contactAddResult").innerHTML = "";

    // Create a temporary object with contact data
    let tmp = {
        name: name,
        phone: phone,
        email: email,
        userId:userId
    };

    // Convert object to JSON
    let jsonPayload = JSON.stringify(tmp);

    // Define the URL endpoint to add the contact
    let url = urlBase + '/AddContact.' + extension;

    // Create XMLHttpRequest for sending data
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            // Check if the request was successful
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact added successfully");
               // document.getElementById("contactAddResult").innerHTML = "Contact has been added";

                // Optionally, redirect to another page after adding the contact
                window.location.href = "option_menu.html";
            }
        };

        xhr.send(jsonPayload);  // Send the contact data
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function editContact(contactId, contactName, contactEmail, contactPhone) {
    // Get the row corresponding to the contactId
    let row = document.getElementById(`contact-${contactId}`);

    // Check if the row is already in "edit mode" (has input fields)
    let isEditing = row.querySelector('input');

    if (isEditing) {
        // Save mode: Get the updated values from the input fields
        let updatedName = document.getElementById(`editName-${contactId}`).value;
        let updatedEmail = document.getElementById(`editEmail-${contactId}`).value;
        let updatedPhone = document.getElementById(`editPhone-${contactId}`).value;
        let userId = localStorage.getItem("userId");
        // Create the payload to send to the server
        let tmp = {
            id: contactId,
            newName: updatedName,
            newEmail: updatedEmail,
            newPhone: updatedPhone,
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + '/EditContact.' + extension;

        // Send the update request to the server via XMLHttpRequest
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error) {
                        document.getElementById("searchResult").innerHTML = jsonObject.error;
                    } else {
                        // Update the row with the new values after saving
                        row.innerHTML = `
                            <td>${updatedName}</td>
                            <td>${updatedEmail}</td>
                            <td>${updatedPhone}</td>
                            <td>
                                <button onclick="deleteContact(${contactId});">Delete</button>
                                <button onclick="editContact(${contactId}, '${updatedName}', '${updatedEmail}', '${updatedPhone}');">Edit</button>
                            </td>
                        `;
                    }
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            document.getElementById("searchResult").innerHTML = err.message;
        }
    } else {
        // Edit mode: Replace the table cells with input fields for editing
        row.innerHTML = `
            <td><input type="text" id="editName-${contactId}" value="${contactName}" /></td>
            <td><input type="email" id="editEmail-${contactId}" value="${contactEmail}" /></td>
            <td><input type="text" id="editPhone-${contactId}" value="${contactPhone}" /></td>
            <td>
                <button onclick="editContact(${contactId}, '${contactName}', '${contactEmail}', '${contactPhone}');">Save</button>
            </td>
        `;
    }
}

function startsWith(string, prefix, n)
{
    return string.substring(0,n) === prefix;
}

function searchContact() {
    // Get the search term from the input field
    document.getElementById("deleteResult").innerHTML = "";
    let searchName = document.getElementById("searchInput").value;
    let userId = localStorage.getItem("userId");
        console.log('this is userID: ' + userId);
    let nameList = "";

    // Clear any previous results
    document.getElementById("searchResult").innerHTML = "";

    // Check if the search term is empty
    if (searchName === "") {
        document.getElementById("searchResult").innerHTML = "Please enter a name to search.";
        return;
    }
        console.log("this is searchname", searchName);
        console.log("this is userID", userId);
    // Create a JSON payload with the search term
    let tmp = { search: searchName, userId:userId };
    let jsonPayload = JSON.stringify(tmp);
    console.log('this is jsonPayload: ',jsonPayload);
    // Define the URL for the search API
    let url = urlBase + '/SearchContact.' + extension;

    // Create XMLHttpRequest for sending the search request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                document.getElementById("searchResult").innerHTML = "Contact has been retrieved";
                console.log('This is xhr.response: ', xhr.responseText);
                let jsonObject = JSON.parse(xhr.responseText);

                console.log('This is jsonObject: ', jsonObject);

                let contacts = jsonObject.results;
                // Check if any contacts were found
                 if (Array.isArray(contacts) && contacts.length > 0) {
                    let contactTable = `
                        <table border="1" cellpadding="10">
                            <thead>
                                <tr>
                                   <th>Name</th>
                                   <th>Email</th>
                                   <th>Phone</th>
                                   <th>Actions</th>
                                </tr>
                             </thead>
                        <tbody> `;


                    // Loop through results and display contact information
                    contacts.forEach(function(contact){
                        contactTable += `
                            <tr id="contact-${contact.ID}">
                                <td>${contact.Name}</td>
                                <td>${contact.Email}</td>
                                <td>${contact.Phone}</td>
                                <td>
                                    <button onclick="deleteContact(${contact.ID});">Delete</button>
                                    <button onclick="editContact(${contact.ID}, '${contact.Name}', '${contact.Email}', '${contact.Phone}');">Edit</button>
                                </td>
                            </tr> `;
                    });
                    contactTable += `
                        </tbody>
                        </table>`;
                        document.getElementById("searchResult").innerHTML = contactTable;
                } else {
                     document.getElementById("searchResult").innerHTML = "No contacts found with that name.";
                }
            }
        };
        console.log(jsonPayload);
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("searchResult").innerHTML = err.message;
    }
}

function deleteContact(contactId) {
    let userId = localStorage.getItem("userId");

    // Clear any previous result messages
    document.getElementById("deleteResult").innerHTML = "";

    // Create a JSON payload with the contact ID to be deleted
    let tmp = { id: contactId, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    // Define the URL for the delete API
    let url = urlBase + '/DeleteContact.' + extension;

    // Create XMLHttpRequest for sending the delete request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // Set up the onreadystatechange event handler
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { // Check if the request is complete
            if (xhr.status == 200) { // Check if the response was successful
                console.log('Delete response: ', xhr.responseText);
                try {
                    let jsonObject = JSON.parse(xhr.responseText);

                    // Check for errors in the response
                    if (jsonObject.Error && jsonObject.Error.length > 0) {
                        document.getElementById("deleteResult").innerHTML = jsonObject.Error;
                    } else {
                        // Remove the deleted contact row from the DOM
                        document.getElementById(`contact-${contactId}`).remove();
                        document.getElementById("deleteResult").innerHTML = "Contact deleted successfully!";
                    }
                } catch (err) {
                    console.error("Error parsing JSON:", err);
                }
            } else {
                document.getElementById("deleteResult").innerHTML = "Failed to delete contact. Please try again.";
                console.error("Error deleting contact:", xhr.status, xhr.statusText);
            }
        }
    };

    // Send the delete request
    try {
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("deleteResult").innerHTML = err.message;
    }
}
document.addEventListener('DOMContentLoaded', ()=> {
    document.getElementById('add').addEventListener('click', openPopup);
});

function openPopup() {
    document.getElementById('search-popup').style.display='block';
}

function closePopup() {
    document.getElementById('search-popup').style.display = 'none';
}
