<?php
        $inData = getRequestInfo();

        $name = $inData["name"];
        $userId = $inData["userId"];
        $phone = $inData["phone"];
        $email = $inData["email"]; 

        $conn = new mysqli("localhost", "Group8", "Project1", "contactManager");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {
                // prepare for all the columns that u will insert into 
                $stmt = $conn->prepare("INSERT into Contacts (UserId, Name, Phone, Email) VALUES (?, ?, ?, ?)");
               
                // bind to the table contacts () name phone email userId 
                // "isss" is 3 string types and one int 
                $stmt->bind_param("isss", $userId, $name, $phone, $email);
                $stmt->execute()

                if ($stmt->execute())
                {
                    if ($stmt->affected_rows > 0) 
                        returnWithInfo($name, $phone, $email);
                    else
                        returnWithError("Did not create");
                
                    // close the prepared statement 
                    $stmt->close();
                }

                // close the connection 
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
                $retValue = '{"error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }
