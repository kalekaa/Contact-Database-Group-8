<?php

    $inData = getRequestInfo();

    $id = 0;
	$firstName = $inData["firstname"];
	$lastName = $inData["lastname"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "Group8", "Project1", "contactManager");

    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // prepare for all the columns that u will insert into 
        $stmt = $conn->prepare("INSERT into Users (ID, FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?, ?)");
        
        // bind to the table Users () id firstName lastName login password
        // "issss" is 4 string types and 1 int 
        $stmt->bind_param("issss", $id, $firstName, $lastName, $login, $password);
        $stmt->execute()

        if ($stmt->execute())
        {
            if ($stmt->affected_rows > 0)
                returnWithInfo($firstName, $lastName, $login);
            else
            returnWithError("Could not add user");
        }

        // close the prepared statement 
        $stmt->close();

        // close the connection 
        $conn->close();
		returnWithError("");
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>