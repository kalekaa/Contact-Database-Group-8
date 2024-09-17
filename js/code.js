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
