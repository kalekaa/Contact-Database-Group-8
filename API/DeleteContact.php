<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();
$id = $inData["id"];
$userId = $inData["userId"];

$conn = new mysqli("localhost", "Group8", "Project1", "contactManager");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserId = ?");
    // Bind as integers
    $stmt->bind_param("ii", $id, $userId);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            returnWithMessage("Contact deleted successfully.");
        } else {
            returnWithError("Could not delete contact.");
        }
    } else {
        returnWithError("Error executing delete.");
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err) {
    $retValue = ['Error' => $err];
    sendResultInfoAsJson($retValue);
}

function returnWithMessage($message) {
    $retValue = ['message' => $message];
    sendResultInfoAsJson($retValue);
}
?>
