<?php

// Connect to database
$servername = "";
$username = "root";
$password = "Gy7ZNu7nDFu/"
$dbname = "contactManager";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>