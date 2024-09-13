<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Get user from db
    $sql = "SELECT * FROM Users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Check if password is correct
        if(password_verify($password, $user['password'])) {
            // Grant access to contact search/add page
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            header("Location search.php");
            exit();
        } else {
            $error = "Invalid password.";
        }
    }

} else {
    $error= "No user found with that email.";
}
?>