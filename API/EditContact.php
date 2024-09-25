<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
        $inData = getRequestInfo();

        $ID = $inData["id"]; // Must have to identify which contact to edit
        $newName = $inData["newName"];
        $newPhone = $inData["newPhone"];
        $newEmail = $inData["newEmail"];  //don't have to change all, can just change one
        $userId = $inData["userId"];

        $conn = new mysqli("localhost", "Group8", "Project1", "contactManager");

    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET Name=?, Phone=?, Email=? WHERE ID = ? AND UserId = ?");
        $stmt->bind_param("sssii", $newName, $newPhone, $newEmail, $ID, $userId);

        if ($stmt->execute())
        {
            if ($stmt->affected_rows == 0)
                returnWithError("Could not edit contact");
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
                $retValue = '{"Error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

?>
