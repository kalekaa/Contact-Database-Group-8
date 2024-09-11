<?php

$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";
$email = ""; 

$conn = new mysqli("localhost", "Group8", "Project1", "contactManager");

if( $conn->connect_error )
{
        returnWithError( $conn->connect_error );
}
else
{
        $stmt = $conn->prepare("SELECT ID, firstName, lastName, Email FROM Users WHERE Login=? AND Password =?");
        $stmt->bind_param("ss", $inData["login"], $inData["password"]);

        if ($stmt->execute())
        {
                $result = $stmt->get_result();
                 if( $row = $result->fetch_assoc())
                        returnWithInfo( $row['firstName'], $row['lastName'], $row['Email'], $row['ID'] );
                 else
                        returnWithError("No Records Found");

                $stmt->close();
        }
        
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
            $retValue = '{"id":0,"firstName":"","lastName":"","email":"","error":"' . $err . '"}';
            sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo( $firstName, $lastName, $id )
        {
                $retValue = '{"id":' . $id . ',"email":' . $email . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
                sendResultInfoAsJson( $retValue );
        }

?>
