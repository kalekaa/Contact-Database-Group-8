<?php

    $inData = getRequestInfo();

    $search = "%" . $inData["search"] . "%";
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
        $stmt = $conn->prepare("SELECT ID,Name,Phone,Email FROM Contacts WHERE (Name LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserId=?");
        $stmt->bind_param("sssi", $search, $search, $search, $userId);
        $stmt->execute();

        $result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if( $searchCount > 0 )
            {
                $searchResults .= ",";
            }
            $searchCount++;
            //"." means concatinate
            $searchResults .= '{"ID" : "' . $row["ID"].'", "Name" : "' . $row["Name"].'", "Phone" : "' . $row["Phone"]. '", "Email" : "' . $row["Email"]. '", "UserId" : "' . $row["UserId"].'"}';
        }

        if( $searchCount == 0 )
        {
            returnWithError( "No Records Found" );
        }
        else
        {
            returnWithInfo( $searchResults );
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

    function returnWithInfo( $searchResults )
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
    }

?>
