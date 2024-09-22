<?php

	$inData = getRequestInfo();
    
	$searchName = "%" . $inData["searchName"] . "%";
    $userId = $inData["userId"];

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "Group8", "Project1", "contactManager");

	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
    {
        
        $stmt = $conn->prepare('SELECT Name, Phone, Email FROM Contacts 
                                WHERE LOWER(Name) LIKE ? 
                                AND User_ID = ?');

        // searching by name to the matching userID 
        $stmt->bind_param('si', $searchName, $userId);
        $stmt->execute();

        $result = $stmt->get_result();
        $contacts = array(); 

        while ($row = $result->fetch_assoc()) {
            $contacts[] = $row;
        }
    
        if (empty($contacts)) 
        {
            returnWithError("No Records Found");
        }
        else 
        {
            returnWithInfo($contacts);
        }

        $stmt->close();
        $conn->close();
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

	function returnWithInfo( $contacts )
	{
        $retValue = json_encode($contacts);
        sendResultInfoAsJson($retValue);

	}

?>
