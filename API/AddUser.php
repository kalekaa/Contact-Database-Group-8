<?php

    $inData = getRequestInfo();

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
        $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");

        // bind to the table Users () id firstName lastName login password
        // "ssss" is 4 string types
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
        $stmt->execute();
        $stmt->close();
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
