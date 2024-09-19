<?php

    $inData = getRequestInfo();

    $name = $inData["name"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "Group8", "Project1", "contactManager");
    
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // prepare for all the columns that u will insert into 
        $stmt = $conn->prepare("INSERT into Contacts (Name, Phone, Email, UserId) VALUES (?, ?, ?, ?)");
        
        // bind to the table contacts () id name phone email userId
        // "sssi" is 3 string types and 1 ints
        $stmt->bind_param("sssi", $name, $phone, $email, $userId);

        if ($stmt->execute())
        {
            if ($stmt->affected_rows > 0)
                returnWithInfo($name, $phone, $email);
            else
                returnWithError("Could not add contact");
        }
        
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
        $retValue = '{"Error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>
