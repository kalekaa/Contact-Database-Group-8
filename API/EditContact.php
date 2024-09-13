<?php

	$inData = getRequestInfo();

	$newFirst = $inData["newFirst"];
	$newLast = $inData["newLast"];
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
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE UserID=?");
        $stmt->bind_param("ssssi", $newFirst, $newLast, $newEmail, $newPhone, $userId);

        if ($stmt->execute())
        {
            if ($stmt->affected_rows > 0)
                returnWithInfo($name, $phone, $email);
            else
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