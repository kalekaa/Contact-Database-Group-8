<?php
    $inData = getRequestInfo();

    $id = $inData["id"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "Group8", "Project1", "contactManager");

    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserId=?"); 
        $stmt->bind_param("ssi", $id, $userId);

          if ($stmt->execute())
          {
              if ($stmt->affected_rows > 0)
                  returnWithInfo($name, $phone, $email);
              else
                  returnWithError("Could not delete contact");
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