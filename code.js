const urlBase = 'http://n8banks.xyz/API';
const extension = 'php';

var display = 1;

function hideShow(popUpID) 
{
    var div = document.getElementById(popUpID);
    if(display == 1) {
        div.style.display = 'block';
        display = 0;
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
        
        div.style.display = 'none';
        display = 1;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
        userId = 0;
        firstName = "";
        lastName = "";
        
        let login = document.getElementById("loginName").value;
        let password = document.getElementById("loginPassword").value;
//      var hash = md5( password );
        
        document.getElementById("loginResult").innerHTML = "";
        if (login === "" || password === "") {
                document.getElementById("loginResult").innerHTML = "Please enter both login and password.";
                return;
        }
        let tmp = {login:login,password:password};
//      var tmp = {login:login,password:hash};

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


function addUser()
{
        
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
        // Get contact details from input fields
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phone").value;
        let idNumber = document.getElementById("idNumber").value;
        
        // Clear any previous result messages
        document.getElementById("contactAddResult").innerHTML = "";

        // Create a temporary object with contact data
        let tmp = {
                name: name,
                email: email,
                phone: phone,
                idNumber: idNumber
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
                        document.getElementById("contactAddResult").innerHTML = "Contact has been added";
                        
                        // Optionally, redirect to another page after adding the contact
                        window.location.href = "contacts_page.html";
                }
                };
                xhr.send(jsonPayload);  // Send the contact data
        } catch (err) {
                document.getElementById("contactAddResult").innerHTML = err.message;
        }
}

function editContact(contactId) {
        // Get updated contact details from input fields
        let name = document.getElementById("editname").value;
        let email = document.getElementById("editEmail").value;
        let phone = document.getElementById("editphone").value;
        let idNumber = document.getElementById("editIdNumber").value;
    
        // Clear any previous result messages
        document.getElementById("editResult").innerHTML = "";
    
        // Create an object with updated contact information
        let tmp = {
            id: contactId,           // Include the contact ID to identify which contact to update
            name: name,
            email: email,
            phone: phone,
            idNumber: idNumber
        };
        let jsonPayload = JSON.stringify(tmp);
    
        // Define the URL for the update API
        let url = urlBase + '/UpdateContact.' + extension;
    
        // Create XMLHttpRequest for sending the update request
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
        try {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
    
                    if (jsonObject.error) {
                        document.getElementById("editResult").innerHTML = jsonObject.error;
                    } else {
                        document.getElementById("editResult").innerHTML = "Contact updated successfully.";
                        // Optionally, redirect to another page or refresh the contact list
                    }
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            document.getElementById("editResult").innerHTML = err.message;
        }
}
    

function searchContact() {
        // Get the search term from the input field
        let searchName = document.getElementById("searchInput").value;
        
        // Clear any previous results
        document.getElementById("searchResult").innerHTML = "";
    
        // Check if the search term is empty
        if (searchName === "") {
            document.getElementById("searchResult").innerHTML = "Please enter a name to search.";
            return;
        }

        // Create a JSON payload with the search term
        let tmp = { search: searchName };
        let jsonPayload = JSON.stringify(tmp);
    
        // Define the URL for the search API
        let url = urlBase + '/SearchContacts.' + extension;
    
        // Create XMLHttpRequest for sending the search request
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
        try {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
    
                    // Check if any contacts were found
                    if (jsonObject.results && jsonObject.results.length > 0) {
                        let contactList = "<ul>";
    
                        // Loop through results and display contact information
                        jsonObject.results.forEach(function(contact) {
                            contactList += "<li>" + contact.fullName + " - " + contact.email + " - " + contact.phoneNumber + "</li>";
                        });
    
                        contactList += "</ul>";
                        document.getElementById("searchResult").innerHTML = contactList;
                    } else {
                        document.getElementById("searchResult").innerHTML = "No contacts found with that name.";
                    }
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            document.getElementById("searchResult").innerHTML = err.message;
        }
    }
    

    function deleteContact(contactId) {
        // Clear any previous result messages
        document.getElementById("deleteResult").innerHTML = "";
    
        // Create a JSON payload with the contact ID to be deleted
        let tmp = { id: contactId };
        let jsonPayload = JSON.stringify(tmp);
    
        // Define the URL for the delete API
        let url = urlBase + '/DeleteContact.' + extension;
    
        // Create XMLHttpRequest for sending the delete request
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
        try {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
    
                    if (jsonObject.error) {
                        document.getElementById("deleteResult").innerHTML = jsonObject.error;
                    } else {
                        document.getElementById("deleteResult").innerHTML = "Contact deleted successfully.";
                        // Optionally, refresh or update the contact list after deletion
                    }
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            document.getElementById("deleteResult").innerHTML = err.message;
        }
    }
